import cv2
import requests
import numpy as np

# --- CONFIGURATION ---
DJANGO_SERVER_URL = "http://127.0.0.1:8000/api/detect_pose/"

# --- STYLING AND SKELETON DEFINITION ---
FONT = cv2.FONT_HERSHEY_SIMPLEX
KEYPOINT_DOT_COLOR = (255, 255, 255) # White for the dots
COLORS = {
    'head': (0, 255, 0),      # Green
    'torso': (255, 0, 255),    # Pink
    'arms': (255, 128, 0),     # Blue
    'legs': (0, 128, 255)      # Orange
}

SKELETON_GROUPS = {
    'torso': [[5, 6], [5, 11], [6, 12], [11, 12]],
    'head': [[0, 1], [0, 2], [1, 3], [2, 4]],
    'arms': [[5, 7], [7, 9], [6, 8], [8, 10]],
    'legs': [[11, 13], [13, 15], [12, 14], [14, 16]]
}


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
                keypoints = person.get('keypoints', [])
                if keypoints:
                    # --- 1. Draw Skeleton Lines ---
                    for part, connections in SKELETON_GROUPS.items():
                        color = COLORS.get(part)
                        for p1_idx, p2_idx in connections:
                            if p1_idx < len(keypoints) and p2_idx < len(keypoints):
                                p1 = keypoints[p1_idx]
                                p2 = keypoints[p2_idx]
                                if p1[0] > 0 and p1[1] > 0 and p2[0] > 0 and p2[1] > 0:
                                    cv2.line(frame, (int(p1[0]), int(p1[1])), (int(p2[0]), int(p2[1])), color, 2)

                    # --- 2. Draw Keypoint Dots ---
                    for point in keypoints:
                        x, y = point
                        if x > 0 and y > 0:
                            cv2.circle(frame, (int(x), int(y)), 4, KEYPOINT_DOT_COLOR, -1) # Draw a filled circle

                # --- 3. Draw Bounding Box and Text ---
                bbox = person.get('bounding_box', {})
                if bbox:
                    x_center, y_center, width, height = bbox['x_center'], bbox['y_center'], bbox['width'], bbox['height']
                    x1 = int(x_center - width / 2)
                    y1 = int(y_center - height / 2)
                    cv2.rectangle(frame, (x1, y1), (int(x1+width), int(y1+height)), (255, 0, 0), 2)
                
                confidence = person.get('confidence', 0)
                label = f"person {confidence:.2f}"
                cv2.putText(frame, label, (x1, y1 - 10), FONT, 0.6, (0, 0, 255), 2)

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