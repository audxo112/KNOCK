from django.urls import path
from . import views

app_name = "users"


urlpatterns = [
    path("rest-auth/google/", views.GoogleLogin.as_view()),
    path("rest-auth/google/editor/", views.GoogleEditorLogin.as_view()),
    path("editor/", views.EditorUserList.as_view()),
    path("editor/detail/<str:id>/", views.EditorUserDetail.as_view()),
    path("search/name-email/<str:search>/", views.SearchWithNameOrEmail.as_view()),
    path("nickname/check/<str:nickname>/", views.CheckNickname.as_view()),
    path("nickname/ban/", views.BanNickname.as_view()),
    path("nickname/ban/check/", views.CheckBanNickname.as_view()),
    path("nickname/ban/delete/<int:id>/", views.BanNicknameDelete.as_view()),
]
