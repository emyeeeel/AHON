from django.db import models

class PoseDetection(models.Model):
    
    image = models.ImageField(upload_to='detections/')
    detection_id = models.CharField(max_length=50)
    confidence = models.FloatField()
    bounding_box = models.JSONField()
    keypoints = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.detection_id} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"