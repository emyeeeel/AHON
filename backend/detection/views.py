# In backend/detection/views.py

import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ultralytics import YOLO
import cv2          
import numpy as np

# --- Model Loading ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

print("Loading YOLOv8-pose model for the API...")
model = YOLO(os.path.join(MODELS_DIR, 'yolov8n-pose.pt'))
print("Model loaded successfully.")

# --- AI Processing Function ---
def process_frame_with_tracking(frame):
    all_detections_data = []
    results = model.track(frame, persist=True, verbose=False, device='cpu')
    
    detection_counter = 1
    if results[0].boxes and results[0].boxes.id is not None:
        for person_result in results[0]:
            box = person_result.boxes[0]
            track_id = box.id.int().cpu().tolist()[0]
            
            confidence = box.conf.cpu().numpy()[0].item()
            bounding_box_xywh = box.xywh.cpu().numpy()[0].tolist()
            keypoints_xy = person_result.keypoints.xy.cpu().numpy()[0].tolist()
            
            person_data = {
                "track_id": track_id,
                "detection_id": f"person_{detection_counter}",
                "confidence": confidence,
                "bounding_box": {"x_center": bounding_box_xywh[0], "y_center": bounding_box_xywh[1], "width": bounding_box_xywh[2], "height": bounding_box_xywh[3]},
                "keypoints": keypoints_xy,
                "position_in_pixels": [bounding_box_xywh[0], bounding_box_xywh[1]]
            }
            all_detections_data.append(person_data)
            detection_counter += 1
            
    return all_detections_data

# --- API View for ESP32/External Devices ---
@csrf_exempt
def detect_pose_view(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        image_bytes = image_file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        detections = process_frame_with_tracking(img_np)
        
        return JsonResponse({"detections": detections})

    return JsonResponse({"error": "Invalid request."}, status=400)

# Add this function to the end of the file
def ping_view(request):
    return JsonResponse({"status": "ok", "message": "Backend is connected!"})