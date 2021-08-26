from django.urls import path
from . import views

app_name = "curations"

urlpatterns = [
    path("/menu/", views.CurationMenuList.as_view()),
    path("/group/", views.GroupList.as_view()),
    path("/group/<str:group_id>/", views.GroupDetail.as_view()),
    path("/folder/", views.FolderList.as_view()),
    path("/folder/<str:folder_id>/", views.FolderDetail.as_view()),
]
