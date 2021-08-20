from django.urls import path
from . import views

app_name = "themes"

urlpatterns = [
    path("", views.ThemeList.as_view()),
    path("upload/", views.UploadTheme.as_view()),
    path("editor/", views.ThemeListInEditor.as_view()),
    path("detail/<str:theme_id>/", views.ThemeDetail.as_view()),
    path("tags/search/<str:search>/", views.SearchTag.as_view()),
    path("search", views.ThemeSearch.as_view()),
    path("search/<str:search>/", views.SearchWithTitleOrTag.as_view()),
    path("recent/links/", views.RecentLink.as_view()),
]
