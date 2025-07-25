from django.db import models


class Mission(models.Model):
    date_time_started = models.DateTimeField()
    date_time_ended = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"Mission ID: {self.id}"
    

class Detection(models.Model):
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    snapshot = models.ImageField(upload_to = "snapshots/", blank=True, null=True)

    def __str__(self):
        return f"Detection ID: {self.id} for Mission ID: {self.mission.id}"
    

class Victim(models.Model):
    detection = models.ForeignKey(Detection, on_delete=models.CASCADE)
    person_recognition_confidence = models.FloatField()
    bounding_box = models.JSONField()  # Assuming bounding box is stored as a JSON object
    coco_keypoints = models.JSONField()  # Assuming COCO keypoints are stored as a JSON object
    movement_category = models.CharField(max_length=50, blank=True, null=True, default='Mobile')
    condition = models.CharField(max_length=50, blank=True, null=True, default='Unknown')
    estimated_longitude = models.FloatField(blank=True, null=True, default=0.0)
    estimated_latitude = models.FloatField(blank=True, null=True, default=0.0)

    def __str__(self):
        return f"Victim ID: {self.id} for Detection ID: {self.detection.id}"