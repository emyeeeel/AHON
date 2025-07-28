import cv2
from ultralytics import YOLO

model = YOLO('yolov8n-pose.pt')

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

print("Webcam started successfully. Press 'q' in the video window to quit.")

# --- Real-time Inference Loop ---
while True:
    # Read one frame from the webcam feed
    success, frame = cap.read()
    if not success:
        print("Failed to capture frame.")
        break

    # Run the pose estimation model on the frame
    results = model(frame, verbose=False)

    # The '.plot()' method automatically draws the bounding boxes and keypoints
    annotated_frame = results[0].plot()

    # Display the final, annotated frame in a window
    cv2.imshow("AHON Laptop Camera Test", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("Webcam stopped and resources released.")