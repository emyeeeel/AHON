from django.db import models

class Device(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    actual_radius = models.FloatField(default=6) 
    is_active = models.BooleanField(default=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Device {self.id} at ({self.latitude}, {self.longitude})"
