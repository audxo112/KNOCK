from django.urls import path
from . import views

app_name = "frames"

urlpatterns = [
    path("", views.FrameList.as_view()),
    path("detail/<str:id>/", views.FrameDetail.as_view()),
    path("max_priority/", views.FrameMaxPriority.as_view()),
]
