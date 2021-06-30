from django.urls import path, include
from .views import VerifyJWTAPIView, RefreshJWTAPIView

app_name = "api"

urlpatterns = [
    # path("rest-auth/google/", )
    path("token/verify/", VerifyJWTAPIView.as_view()),
    path("token/refresh/", RefreshJWTAPIView.as_view()),
    path(
        "users/",
        include("users.urls", namespace="users"),
    ),
    path(
        "themes/",
        include("themes.urls", namespace="themes"),
    ),
    path(
        "curations/",
        include("curations.urls", namespace="curations"),
    ),
    path(
        "frames/",
        include("frames.urls", namespace="frames"),
    ),
    path(
        "lists/",
        include("lists.urls", namespace="lists"),
    ),
    path(
        "logs/",
        include("knocklogs.urls", namespace="knocklogs"),
    ),
]
