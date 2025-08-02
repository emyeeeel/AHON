import cv2
import requests
import numpy as np

# --- CONFIGURATION ---
DJANGO_SERVER_URL = "http://127.0.0.1:8000/api/detect_pose/"

# --- STYLING ---
BOX_COLOR = (255, 0, 0)       # Blue
TEXT_COLOR = (0, 0, 255)      # Red
SKELETON_COLOR = (0, 255, 0)  # Green
FONT = cv2.FONT_HERSHEY_SIMPLEX

# Define the connections for the COCO 17-point skeleton
SKELETON = [
    [16, 14], [14, 12], [17, 15], [15, 13], [12, 13], [6, 12], [7, 13],
    [6, 7], [6, 8], [7, 9], [8, 10], [9, 11], [2, 3], [1, 2], [1, 3],
    [2, 4], [3, 5], [4, 6], [5, 7]
]
# NOTE: The indices above are 1-based from some docs, but Python is 0-based.
# We will adjust for this in the code by subtracting 1.
# Correct 0-based COCO skeleton connections:
SKELETON_Z_BASED = [
    [15, 13], [13, 11], [16, 14], [14, 12], [11, 12], [5, 11], [6, 12],
    [5, 6], [5, 7], [6, 8], [7, 9], [8, 10], [1, 2], [0, 1], [0, 2],
    [1, 3], [2, 4], [3, 5], [4, 6]
]


def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    print("Starting camera stream... Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        _, img_encoded = cv2.imencode('.jpg', frame)
        files = {'image': ('frame.jpg', img_encoded.tobytes(), 'image/jpeg')}
        
        try:
            response = requests.post(DJANGO_SERVER_URL, files=files, timeout=5)
            response.raise_for_status() 
            detections = response.json().get('detections', [])
            
            for person in detections:
                # --- 1. Draw Skeleton Lines ---
                keypoints = person.get('keypoints', [])
                if keypoints:
                    for connection in SKELETON_Z_BASED:
                        p1_idx, p2_idx = connection
                        # Check if keypoints exist and are detected
                        if p1_idx < len(keypoints) and p2_idx < len(keypoints):
                            p1 = keypoints[p1_idx]
                            p2 = keypoints[p2_idx]
                            # Draw line only if both points were detected (are not 0,0)
                            if p1[0] > 0 and p1[1] > 0 and p2[0] > 0 and p2[1] > 0:
                                cv2.line(frame, (int(p1[0]), int(p1[1])), (int(p2[0]), int(p2[1])), SKELETON_COLOR, 2)
                
                # --- 2. Draw Bounding Box ---
                bbox = person.get('bounding_box', {})
                if bbox:
                    x_center, y_center, width, height = bbox['x_center'], bbox['y_center'], bbox['width'], bbox['height']
                    x1 = int(x_center - width / 2)
                    y1 = int(y_center - height / 2)
                    x2 = int(x_center + width / 2)
                    y2 = int(y_center + height / 2)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), BOX_COLOR, 2)
                
                # --- 3. Draw Text Labels ---
                detection_id = person.get('detection_id', 'N/A')
                confidence = person.get('confidence', 0)
                label = f"{detection_id.split('_')[0]} {confidence:.2f}"
                cv2.putText(frame, label, (x1, y1 - 10), FONT, 0.6, TEXT_COLOR, 2)

        except requests.exceptions.RequestException as e:
            print(f"Error sending request: {e}")

        cv2.imshow('Live Camera Feed', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Stream stopped.")

if __name__ == "__main__":
    main()