from django.shortcuts import render

# Create your views here.
# In backend/mission/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def mission_list_view(request):
    if request.method == 'POST':
        # This is a placeholder to simulate creating a mission
        # It receives the request and returns a sample response
        print("Received request to create a mission.")
        return JsonResponse({
            "id": 1, # Sample ID
            "date_time_started": json.loads(request.body).get('date_time_started'),
            "date_time_ended": None
        }, status=201)

    # This handles GET requests if you need to list missions later
    return JsonResponse([], safe=False)