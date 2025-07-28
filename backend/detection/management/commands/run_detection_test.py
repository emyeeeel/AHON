from django.test import TestCase

# Create your tests here.
# In backend/detection/management/commands/run_detection_test.py

import os
import json
from django.core.management.base import BaseCommand
from ultralytics import YOLO
from detection.models import PoseDetection # Import your model

class Command(BaseCommand):
    help = 'Runs a test of the YOLOv8 pose detection on a sample image and saves the result.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("--- Starting Detection Test Script ---"))

        # --- 1. Define Paths ---
        # IMPORTANT: Make sure this path to a sample image is correct
        sample_image_path = 'C:\\Users\\AJ\\Documents\\SCHOOL NEEDS\\Thesis-AHON\\datasets\\DiagonalViewOnly-ThermalHumanDetection\\sample_images\\3563.png'

        # Check if the sample image exists
        if not os.path.exists(sample_image_path):
            self.stdout.write(self.style.ERROR(f"Error: Sample image not found at {sample_image_path}"))
            return

        # --- 2. Load the Model ---
        self.stdout.write("Loading YOLOv8-pose model...")
        model = YOLO('yolov8n-pose.pt')
        self.stdout.write(self.style.SUCCESS("Model loaded successfully."))

        # --- 3. Run Inference ---
        self.stdout.write(f"Running detection on '{os.path.basename(sample_image_path)}'...")
        # We pass the FILE PATH directly, which is the most reliable method
        results = model(sample_image_path, verbose=False)

        # --- 4. Process and Save Results ---
        detection_counter = 1
        for person_result in results[0]:
            box = person_result.boxes[0]
            confidence = box.conf.cpu().numpy()[0].item()
            bounding_box_xywh = box.xywh.cpu().numpy()[0].tolist()
            keypoints_xy = person_result.keypoints[0].xy.cpu().numpy()[0].tolist()
            detection_id_str = f"person_{detection_counter}"

            # Prepare data for the database
            person_data_for_db = {
                "detection_id": detection_id_str,
                "confidence": confidence,
                "bounding_box": {"x_center": bounding_box_xywh[0], "y_center": bounding_box_xywh[1], "width": bounding_box_xywh[2], "height": bounding_box_xywh[3]},
                "keypoints": keypoints_xy,
                "positions_in_pixels": {"x": bounding_box_xywh[0], "y": bounding_box_xywh[1]}
            }

            # Save the result to the database
            # NOTE: The 'image' field is not saved in this test to keep it simple
            PoseDetection.objects.create(
                detection_id=detection_id_str,
                confidence=confidence,
                bounding_box=person_data_for_db["bounding_box"],
                keypoints=person_data_for_db["keypoints"]
            )
            self.stdout.write(self.style.SUCCESS(f"Saved {detection_id_str} to the database."))
            
            # Print the JSON that would be sent to the frontend
            print(json.dumps(person_data_for_db, indent=4))
            
            detection_counter += 1
            
        self.stdout.write(self.style.SUCCESS("\n--- Test complete. ---"))