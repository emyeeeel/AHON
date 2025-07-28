from rest_framework import serializers
from mission.models import Mission, Victim


class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = '__all__'


class VictimSerializer(serializers.ModelSerializer):
    detection_id = serializers.ReadOnlyField(source='detection.id')
    mission_id = serializers.ReadOnlyField(source='detection.mission.id')

    class Meta:
        model = Victim
        fields = '__all__'
