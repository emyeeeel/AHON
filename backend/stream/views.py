# from django.http import StreamingHttpResponse
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from PIL import Image
# from io import BytesIO
# import os
# from django.conf import settings

# class ImageStreamView(APIView):
#     """
#     API View that streams images in multipart format for live camera feed
#     """

#     def get_image_generator(self):
#         """Generator function that yields image frames"""
#         while True:
#             try:
#                 # Dynamic paths to the images
#                 image_path = os.path.join(settings.BASE_DIR, 'image.jpg')
#                 placeholder_path = os.path.join(settings.BASE_DIR, 'placeholder.jpg')

#                 # Try to read the main image
#                 if os.path.exists(image_path):
#                     with open(image_path, "rb") as f:
#                         image_bytes = f.read()
#                 else:
#                     raise FileNotFoundError("image.jpg not found")

#                 # Validate and process image
#                 image = Image.open(BytesIO(image_bytes))
#                 img_io = BytesIO()
#                 image.save(img_io, 'JPEG')
#                 img_io.seek(0)
#                 img_bytes = img_io.read()

#                 yield (b'--frame\r\n'
#                        b'Content-Type: image/jpeg\r\n\r\n' + img_bytes + b'\r\n')

#             except Exception as e:
#                 print(f"Error streaming image: {e}")
#                 # Fallback to placeholder image
#                 try:
#                     with open(placeholder_path, "rb") as f:
#                         image_bytes = f.read()

#                     image = Image.open(BytesIO(image_bytes))
#                     img_io = BytesIO()
#                     image.save(img_io, 'JPEG')
#                     img_io.seek(0)
#                     img_bytes = img_io.read()

#                     yield (b'--frame\r\n'
#                            b'Content-Type: image/jpeg\r\n\r\n' + img_bytes + b'\r\n')
#                 except Exception as fallback_error:
#                     print(f"Fallback image error: {fallback_error}")
#                     # Yield empty frame if both images fail
#                     yield (b'--frame\r\n'
#                            b'Content-Type: image/jpeg\r\n\r\n' + b'\r\n')

#     def get(self, request):
#         """Stream images as multipart response"""
#         response = StreamingHttpResponse(
#             self.get_image_generator(),
#             content_type='multipart/x-mixed-replace; boundary=frame'
#         )
#         return response


# class ImageStatusView(APIView):
#     """
#     API View to check if image exists and get basic info
#     """

#     def get(self, request):
#         """Get status of current image"""
#         try:
#             # Dynamic paths to the images
#             image_path = os.path.join(settings.BASE_DIR, 'image.jpg')

#             if os.path.exists(image_path):
#                 # Get file size
#                 file_size = os.path.getsize(image_path)

#                 # Try to get image dimensions
#                 try:
#                     with open(image_path, "rb") as f:
#                         image = Image.open(f)
#                         width, height = image.size

#                     return Response({
#                         'status': 'available',
#                         'file_size': file_size,
#                         'dimensions': {
#                             'width': width,
#                             'height': height
#                         }
#                     })
#                 except Exception as e:
#                     return Response({
#                         'status': 'invalid',
#                         'file_size': file_size,
#                         'error': str(e)
#                     })
#             else:
#                 return Response({
#                     'status': 'not_found',
#                     'message': 'No image available'
#                 }, status=status.HTTP_404_NOT_FOUND)

#         except Exception as e:
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# In stream/views.py
import cv2
import requests
from django.http import StreamingHttpResponse

# --- STYLING AND SKELETON DEFINITION ---
FONT = cv2.FONT_HERSHEY_SIMPLEX
COLORS = { 'head': (0, 255, 0), 'torso': (255, 0, 255), 'arms': (255, 128, 0), 'legs': (0, 128, 255) }
KEYPOINT_DOT_COLOR = (255, 255, 255) # White
BOX_COLOR = (255, 0, 0) # Blue
TEXT_COLOR = (255, 255, 255) # White
TEXT_BG_COLOR = (255, 0, 0) # Blue

SKELETON_GROUPS = {
    'torso': [[5, 6], [5, 11], [6, 12], [11, 12]], 'head': [[0, 1], [0, 2], [1, 3], [2, 4]],
    'arms': [[5, 7], [7, 9], [6, 8], [8, 10]], 'legs': [[11, 13], [13, 15], [12, 14], [14, 16]]
}

def stream_generator():
    detection_url = "http://127.0.0.1:8000/api/detect_pose/"
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Cannot open camera.")
        return

    while True:
        ret, frame = cap.read()
        if not ret: break

        _, img_encoded = cv2.imencode('.jpg', frame)
        files = {'image': ('frame.jpg', img_encoded.tobytes(), 'image/jpeg')}

        try:
            response = requests.post(detection_url, files=files, timeout=2)
            if response.status_code == 200:
                detections = response.json().get('detections', [])
                
                # This will print the full JSON with the new 'track_id' to your terminal
                print(detections)
                
                for person in detections:
                    keypoints = person.get('keypoints', [])
                    
                    # Draw Skeleton and Dots
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
                        
                        # --- THIS IS THE UPDATED PART ---
                        confidence = person.get('confidence', 0)
                        track_id = person.get('track_id', -1)
                        # Create a new label that includes the track_id
                        label = f"ID {track_id}: person {confidence:.2f}"
                        # --- END OF UPDATE ---
                        
                        (w, h), _ = cv2.getTextSize(label, FONT, 0.6, 2)
                        
                        cv2.rectangle(frame, (x1, y1 - 20), (x1 + w, y1), TEXT_BG_COLOR, -1)
                        cv2.putText(frame, label, (x1, y1 - 5), FONT, 0.6, TEXT_COLOR, 2)

        except requests.exceptions.RequestException:
            pass 

        _, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    cap.release()

def video_feed_view(request):
    return StreamingHttpResponse(stream_generator(), content_type='multipart/x-mixed-replace; boundary=frame')