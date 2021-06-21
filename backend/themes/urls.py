from django.urls import path
from . import views

app_name = "themes"

urlpatterns = [
    path("", views.ThemeList.as_view()),
    path("detail/<str:id>/", views.ThemeDetail.as_view()),
    # path("theme_list/search/", views.SearchTheme.as_view()),
    path("tags/search/<str:search>/", views.SearchTag.as_view()),
    path("search/<str:search>/", views.SearchWithTitleOrTag.as_view()),
    path("recent/links/", views.RecentLink.as_view()),
]
