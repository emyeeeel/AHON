from django.urls import path
from . import views

urlpatterns = [
    path('stream/', views.ImageStreamView.as_view(), name='image-stream'),
    path('status/', views.ImageStatusView.as_view(), name='image-status'),

    path('image/', views.SimpleImageView.as_view(), name='simple-image'),
]