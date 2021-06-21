from django.urls import path
from . import views

app_name = "lists"

urlpatterns = [
    path("themes/", views.ThemeList.as_view()),
    path("themes/detail/<str:list_id>/", views.ThemeListDetail.as_view()),
]
