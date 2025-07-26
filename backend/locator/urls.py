from django.urls import path
from . import views

urlpatterns = [
    path('device-data/', views.get_device_map_data, name='get_device_map_data'),
    path('devices/', views.get_all_devices, name='get_all_devices'),
    path('devices/delete-all/', views.delete_all_devices, name='delete_all_devices'),
]
