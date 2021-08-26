from django.urls import path
from . import views

app_name = "logs"

urlpatterns = [
    path("/applied_theme", views.AppliedThemeLogData.as_view()),
    path("/appling_theme", views.ApplingThemeLogData.as_view()),
    path("/enter_theme_link", views.EnterThemeLinkLogData.as_view()),
    path("/encoding", views.EncodingLogData.as_view()),
]
