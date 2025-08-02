# In backend/detection/views.py

import os
import json
from .models import PoseDetection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ultralytics import YOLO
import cv2      
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

print("Loading all YOLOv8-pose models...")
MODELS = {
    'default': YOLO(os.path.join(MODELS_DIR, 'yolov8n-pose.pt')),
    # UNCOMMENT these lines later when you have your custom models:
    # 'front': YOLO(os.path.join(MODELS_DIR, 'front_view_pose.pt')),
    # 'angled': YOLO(os.path.join(MODELS_DIR, 'angled_view_pose.pt')),
    # 'top': YOLO(os.path.join(MODELS_DIR, 'top_view_pose.pt')),
}
print("All models loaded successfully.")


@csrf_exempt
def detect_pose_view(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']

        # Read the image file's bytes into memory
        image_bytes = image_file.read()
        # Convert the bytes to a NumPy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        # Decode the array into an OpenCV image
        img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # --- 2. Dynamic Model Selection (Commented Out for Now) ---
        # LATER, your frontend will send a 'view_type' (e.g., 'front', 'angled', 'top')
        # view_type = request.POST.get('view_type', 'default')
        # selected_model = MODELS.get(view_type, MODELS['default'])
        
        # FOR NOW, we will just use the default model
        selected_model = MODELS['default']


        results = selected_model.track(img_np, persist=True, verbose=False, device='cpu')
        
        all_detections_data = []
        detection_counter = 1
        
        for person_result in results[0]:
            box = person_result.boxes[0]
            confidence = box.conf.cpu().numpy()[0].item()
            bounding_box_xywh = box.xywh.cpu().numpy()[0].tolist()
            keypoints_xy = person_result.keypoints[0].xy.cpu().numpy()[0].tolist()
            
            detection_id_str = f"person_{detection_counter}"

            track_id = box.id.int().cpu().tolist()[0] if box.id is not None else -1

            person_data = {
                "track_id": track_id,
                "detection_id": detection_id_str,
                "confidence": confidence,
                "bounding_box": {"x_center": bounding_box_xywh[0], "y_center": bounding_box_xywh[1], "width": bounding_box_xywh[2], "height": bounding_box_xywh[3]},
                "keypoints": keypoints_xy,
                "position_in_pixels": [bounding_box_xywh[0], bounding_box_xywh[1]]
            }
            all_detections_data.append(person_data)

            PoseDetection.objects.create(
                image=image_file,
                detection_id=detection_id_str,
                confidence=person_data["confidence"],
                bounding_box=person_data["bounding_box"],
                keypoints=person_data["keypoints"]
            )
            
            
            detection_counter += 1

        return JsonResponse({"detections": all_detections_data})

    return JsonResponse({"error": "Invalid request. Please send a POST request with an 'image'."}, status=400)