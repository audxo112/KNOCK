from django.urls import path
from . import views

app_name = "frames"

urlpatterns = [
    path("", views.FrameList.as_view()),
    path("/detail/<str:frame_id>", views.FrameDetail.as_view()),
    path("/editor", views.FrameListInEditor.as_view()),
    path("/editor/max_priority", views.FrameMaxPriority.as_view()),
]
