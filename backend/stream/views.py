import mimetypes
from django.http import HttpResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
from io import BytesIO
import os
from django.conf import settings

class ImageStreamView(APIView):
    """
    API View that streams images in multipart format for live camera feed
    """

    def get_image_generator(self):
        """Generator function that yields image frames"""
        while True:
            try:
                # Dynamic paths to the images
                image_path = os.path.join(settings.BASE_DIR, 'image.jpg')
                placeholder_path = os.path.join(settings.BASE_DIR, 'placeholder.jpg')

                # Try to read the main image
                if os.path.exists(image_path):
                    with open(image_path, "rb") as f:
                        image_bytes = f.read()
                else:
                    raise FileNotFoundError("image.jpg not found")

                # Validate and process image
                image = Image.open(BytesIO(image_bytes))
                img_io = BytesIO()
                image.save(img_io, 'JPEG')
                img_io.seek(0)
                img_bytes = img_io.read()

                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + img_bytes + b'\r\n')

            except Exception as e:
                print(f"Error streaming image: {e}")
                # Fallback to placeholder image
                try:
                    with open(placeholder_path, "rb") as f:
                        image_bytes = f.read()

                    image = Image.open(BytesIO(image_bytes))
                    img_io = BytesIO()
                    image.save(img_io, 'JPEG')
                    img_io.seek(0)
                    img_bytes = img_io.read()

                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + img_bytes + b'\r\n')
                except Exception as fallback_error:
                    print(f"Fallback image error: {fallback_error}")
                    # Yield empty frame if both images fail
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + b'\r\n')

    def get(self, request):
        """Stream images as multipart response"""
        response = StreamingHttpResponse(
            self.get_image_generator(),
            content_type='multipart/x-mixed-replace; boundary=frame'
        )
        return response


class ImageStatusView(APIView):
    """
    API View to check if image exists and get basic info
    """

    def get(self, request):
        """Get status of current image"""
        try:
            # Dynamic paths to the images
            image_path = os.path.join(settings.BASE_DIR, 'image.jpg')

            if os.path.exists(image_path):
                # Get file size
                file_size = os.path.getsize(image_path)

                # Try to get image dimensions
                try:
                    with open(image_path, "rb") as f:
                        image = Image.open(f)
                        width, height = image.size

                    return Response({
                        'status': 'available',
                        'file_size': file_size,
                        'dimensions': {
                            'width': width,
                            'height': height
                        }
                    })
                except Exception as e:
                    return Response({
                        'status': 'invalid',
                        'file_size': file_size,
                        'error': str(e)
                    })
            else:
                return Response({
                    'status': 'not_found',
                    'message': 'No image available'
                }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SimpleImageView(APIView):
    """
    API View to serve the current image.jpg file directly
    """
    def get(self, request):
        try:
            # Check if image exists
            if not os.path.exists("image.jpg"):
                return Response(
                    {"error": "Image not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Determine content type
            content_type, _ = mimetypes.guess_type("image.jpg")
            if content_type is None:
                content_type = 'image/jpeg'
            
            # Read and return the image
            with open("image.jpg", 'rb') as f:
                image_data = f.read()
            
            response = HttpResponse(image_data, content_type=content_type)
            response['Content-Disposition'] = 'inline; filename="image.jpg"'
            return response
            
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
