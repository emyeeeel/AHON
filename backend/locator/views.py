from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Device

@csrf_exempt
@require_http_methods(["POST"])
def get_device_map_data(request):
    """
    Endpoint to receive GPS coordinates, save to Device model, and return device map configuration
    """
    try:
        data = json.loads(request.body)
        lat = data.get('latitude')
        lon = data.get('longitude')
        
        if lat is None or lon is None:
            return JsonResponse({'error': 'Latitude and longitude are required'}, status=400)
        
        # Create a new device record with the received coordinates
        device = Device.objects.create(
            latitude=float(lat),
            longitude=float(lon)
        )
        
        # Display multiplier remains constant
        display_multiplier = 10  # for visualization
        
        response_data = {
            'device_location': {
                'id': device.id,
                'lat': device.latitude,
                'lon': device.longitude
            },
            'camera_radius': {
                'actual_radius': device.actual_radius,
                'display_radius': device.actual_radius * display_multiplier
            },
            'map_config': {
                'zoom_level': 20,
                'center': [device.latitude, device.longitude]
            }
        }
        
        return JsonResponse(response_data)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_all_devices(request):
    """
    Endpoint to retrieve all device records
    """
    try:
        devices = Device.objects.all().order_by('-created_at')  # Most recent first
        
        display_multiplier = 10
        
        device_list = []
        for device in devices:
            device_list.append({
                'id': device.id,
                'location': {
                    'lat': device.latitude,
                    'lon': device.longitude
                },
                'is_active': device.is_active,
                'camera_radius': {
                    'actual_radius': device.actual_radius,
                    'display_radius': device.actual_radius * display_multiplier
                },
                'timestamp': device.created_at.isoformat()
            })
        
        return JsonResponse({'devices': device_list})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_all_devices(request):
    """
    Admin endpoint to delete all device records
    """
    try:
        count, _ = Device.objects.all().delete()
        return JsonResponse({'message': f'Successfully deleted {count} devices'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
