"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
from detection.views import detect_pose_view, ping_view
from stream.views import video_feed_view, stream_page_view, detection_data_stream_view
from mission.views import mission_list_view 

urlpatterns = [
    path("admin/", admin.site.urls),
    # path('api/', include('stream.urls')),

    path('mission-api/missions/', mission_list_view, name='mission-list'),
    
    # API endpoint for detection
    path('api/detect_pose/', detect_pose_view, name='detect_pose'),

    path('api/video_feed/', video_feed_view, name='video_feed'),

    path('api/detection_data/', detection_data_stream_view, name='detection_data'),

    path('stream_page/', stream_page_view, name='stream_page'),
]
