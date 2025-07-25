from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from backend.mission.model_views.mission_views import MissionDetail, MissionList
from backend.mission.model_views.victim_views import AllVictimsView, VictimDetailView, VictimsByMissionView


[
    # Mission URLs
    path('missions/', MissionList.as_view()),
    path('mission/<int:pk>/', MissionDetail.as_view()),

    # Victim URLs
    # Victims by mission ID
    path('mission/<int:mission_id>/victims/', VictimsByMissionView.as_view(), name='victims-by-mission'),
    path('victims/', AllVictimsView.as_view(), name='all-victims'),
    path('victim/<int:pk>/', VictimDetailView.as_view(), name='victim-detail'),
]

