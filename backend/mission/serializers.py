from rest_framework import serializers
from backend.mission.models import Detection, Mission, Victim


class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = '__all__'


class DetectionSerializer(serializers.ModelSerializer):
    mission = MissionSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Detection
        fields = '__all__'


class VictimSerializer(serializers.ModelSerializer):
    detection_id = serializers.ReadOnlyField(source='detection.id')
    mission_id = serializers.ReadOnlyField(source='detection.mission.id')

    class Meta:
        model = Victim
        fields = '__all__'
