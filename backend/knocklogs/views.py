from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models, serializers


class AppliedThemeLogData(APIView):
    def get(self, request):
        queryset = models.AppliedThemeLog.objects.all()
        serializer = serializers.AppliedThemeLogSerializer(queryset, many=True)
        return Response(serializer.data)


class ApplingThemeLogData(APIView):
    def get(self, request):
        queryset = models.ApplingThemeLog.objects.all()
        serializer = serializers.ApplingThemeLogSerializer(queryset, many=True)
        return Response(serializer.data)


class EnterThemeLinkLogData(APIView):
    def get(self, request):
        queryset = models.EnterThemeLinkLog.objects.all()
        serializer = serializers.EnterThemeLinkLogSerializer(queryset, many=True)
        return Response(serializer.data)


class EncodingLogData(APIView):
    def get(self, request):
        queryset = models.EncodingLog.objects.all()
        serializer = serializers.EncodingLogSerializer(queryset, many=True)
        return Response(serializer.data)
