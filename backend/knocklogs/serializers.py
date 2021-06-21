from rest_framework import serializers
from . import models


class AppliedThemeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AppliedThemeLog
        fields = (
            "device_id",
            "theme",
            "created",
        )


class ApplingThemeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ApplingThemeLog
        fields = (
            "device_id",
            "theme",
            "created",
        )


class EnterThemeLinkLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EnterThemeLinkLog
        fields = (
            "device_id",
            "theme",
        )


class EncodingLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EncodingLog
        fields = (
            "device_id",
            "resource_type",
            "src_duration",
            "dst_duration",
            "frame_type",
            "template",
            "is_cut",
            "is_boomerang",
            "bg_color",
        )
