from django.http import Http404

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from backend.mission.models import Mission, Victim
from backend.mission.serializers import VictimSerializer


class VictimDetailView(APIView):
    """
    Retrieve, update or delete a specific victim
    """
    def get_object(self, pk):
        try:
            return Victim.objects.get(pk=pk)
        except Victim.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        try:
            victim = self.get_object(pk)
            serializer = VictimSerializer(victim)
            return Response(serializer.data)
        except Victim.DoesNotExist:
            return Response({"error": "Victim not found"}, status=status.HTTP_404_NOT_FOUND )
    
    def put(self, request, pk, format=None):
        try:
            victim = self.get_object(pk)
            
            # Update fields from request data
            victim.estimated_latitude = request.data.get('estimated_latitude', victim.estimated_latitude)
            victim.estimated_longitude = request.data.get('estimated_longitude', victim.estimated_longitude)
            victim.save()
            
            serializer = VictimSerializer(victim)
            return Response(serializer.data)
            
        except Victim.DoesNotExist:
            return Response({"error": "Victim not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, pk, format=None):
        victim = self.get_object(pk)
        victim.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AllVictimsView(APIView):
    """
    Get all victims across all detections
    """
    def get(self, request):
        try:
            victims = Victim.objects.all().order_by('-detection__timestamp')
            serializer = VictimSerializer(victims, many=True)
            return Response({
                'victims_count': len(victims),
                'victims': serializer.data
            })
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VictimsByMissionView(APIView):
    """
    Get all victims for a specific mission
    """
    def get(self, request, mission_id):
        try:
            # Check if mission exists
            mission = mission.objects.get(id=mission_id)
            
            # Get all victims for this mission
            victims = Victim.objects.filter(mission=mission)
            
            # Serialize the victims
            serializer = VictimSerializer(victims, many=True)
            
            return Response({
                'mission_id': mission_id,
                'victims_count': len(victims),
                'victims': serializer.data
            })
            
        except mission.DoesNotExist:
            return Response({"error": "mission not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)