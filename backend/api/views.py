from rest_framework_jwt.views import JSONWebTokenAPIView

from .jwt import VerifyJWTSerializer, RefreshJWTSerializer


class VerifyJWTAPIView(JSONWebTokenAPIView):
    serializer_class = VerifyJWTSerializer


class RefreshJWTAPIView(JSONWebTokenAPIView):
    serializer_class = RefreshJWTSerializer
