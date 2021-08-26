from django.urls import path
from . import views

app_name = "lists"

urlpatterns = [
    path("/themes", views.ThemeList.as_view()),
    path("/themes/editor", views.ThemeListInEditor.as_view()),
    path("/themes/editor/detail/<str:list_id>", views.ThemeListDetail.as_view()),
]
