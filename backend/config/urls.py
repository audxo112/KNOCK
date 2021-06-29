"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings
from api.views import VerifyJWTAPIView, RefreshJWTAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
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

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
