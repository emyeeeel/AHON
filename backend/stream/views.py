# In backend/stream/views.py

import cv2
import json
import time
import threading
from django.http import StreamingHttpResponse
from django.shortcuts import render
from detection.views import process_frame_with_tracking
import base64

# --- Global variables to share data from the camera thread ---
frame_lock = threading.Lock()
output_frame = None
detection_data_json = "{}"

# --- This is the single process that controls the camera and AI ---
def camera_worker_thread():
    global output_frame, detection_data_json
    
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Cannot open camera in background thread.")
        return

    # --- Styling ---
    FONT = cv2.FONT_HERSHEY_SIMPLEX
    COLORS = { 'head': (0, 255, 0), 'torso': (255, 0, 255), 'arms': (255, 128, 0), 'legs': (0, 128, 255) }
    KEYPOINT_DOT_COLOR = (255, 255, 255)
    BOX_COLOR = (255, 0, 0)
    TEXT_COLOR = (255, 255, 255)
    TEXT_BG_COLOR = (255, 0, 0)
    SKELETON_GROUPS = {
        'torso': [[5, 6], [5, 11], [6, 12], [11, 12]],
        'head': [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6]],
        'arms': [[5, 7], [7, 9], [6, 8], [8, 10]],
        'legs': [[11, 13], [13, 15], [12, 14], [14, 16]]
    }

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        clean_frame = frame.copy()

        detections = process_frame_with_tracking(frame)
        person_count = len(detections)
        
        for person in detections:
            # (All drawing logic is the same)
            keypoints = person.get('keypoints', [])
            for part, connections in SKELETON_GROUPS.items():
                color = COLORS.get(part)
                for p1_idx, p2_idx in connections:
                    if p1_idx < len(keypoints) and p2_idx < len(keypoints):
                        p1, p2 = keypoints[p1_idx], keypoints[p2_idx]
                        if p1[0] > 0 and p2[0] > 0:
                            cv2.line(frame, (int(p1[0]), int(p1[1])), (int(p2[0]), int(p2[1])), color, 2)
            for x, y in keypoints:
                if x > 0: cv2.circle(frame, (int(x), int(y)), 4, KEYPOINT_DOT_COLOR, -1)
            
            bbox = person.get('bounding_box', {})
            if bbox:
                x_center, y_center, width, height = bbox['x_center'], bbox['y_center'], bbox['width'], bbox['height']
                x1 = int(x_center - width / 2)
                y1 = int(y_center - height / 2)
                cv2.rectangle(frame, (x1, y1), (int(x1 + width), int(y1 + height)), BOX_COLOR, 2)
                
                confidence = person.get('confidence', 0)
                track_id = person.get('track_id', -1)
                label = f"ID {track_id}: person {confidence:.2f}"
                (w, h), _ = cv2.getTextSize(label, FONT, 0.6, 2)
                cv2.rectangle(frame, (x1, y1 - 20), (x1 + w, y1), TEXT_BG_COLOR, -1)
                cv2.putText(frame, label, (x1, y1 - 5), FONT, 0.6, TEXT_COLOR, 2)
        
        _, jpg_buffer = cv2.imencode('.jpg', frame)

        _, clean_jpg_buffer = cv2.imencode('.jpg', clean_frame)
        snapshot_b64 = base64.b64encode(clean_jpg_buffer).decode('utf-8')
        
        with frame_lock:
            output_frame = jpg_buffer.tobytes()
            detection_data_json = json.dumps({
            "personCount": person_count,
            "snapshot": snapshot_b64,
            "detections": detections
        })
    
    cap.release()

def video_stream_generator():
    global output_frame
    while True:
        with frame_lock:
            if output_frame is None:
                continue
            frame_bytes = output_frame
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.03)

def detection_data_stream_generator():
    global detection_data_json
    last_data_sent = ""
    while True:
        with frame_lock:
            if detection_data_json == last_data_sent:
                time.sleep(0.03)
                continue
            data_to_send = detection_data_json
            last_data_sent = data_to_send

        yield f"data: {data_to_send}\n\n"
    
def video_feed_view(request):
    return StreamingHttpResponse(video_stream_generator(), content_type='multipart/x-mixed-replace; boundary=frame')
    
def detection_data_stream_view(request):
    response = StreamingHttpResponse(detection_data_stream_generator(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    return response
    
def stream_page_view(request):
    return render(request, 'index.html')

thread = threading.Thread(target=camera_worker_thread, daemon=True)
thread.start()