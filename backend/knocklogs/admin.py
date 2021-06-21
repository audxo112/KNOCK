from django.contrib import admin
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from core import admin as core_admin
from core.admin import FleetAdmin as f_admin
from . import models as log_models


@admin.register(log_models.AppliedThemeLog)
class AppliedThemeLogAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("테마 적용 기록"),
            {
                "fields": (
                    "device_id",
                    "theme",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "theme",
        "created",
    )

    readonly_fields = f_admin.readonly_fields + ("device_id",)


@admin.register(log_models.ApplingThemeLog)
class ApplingThemeLogAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("적용중인 테마 기록"),
            {
                "fields": (
                    "device_id",
                    "theme",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "theme",
        "created",
    )

    readonly_fields = f_admin.readonly_fields + ("device_id",)


@admin.register(log_models.EnterThemeLinkLog)
class EnterThemeLinkLogAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("테마 링크 사용 기록"),
            {
                "fields": (
                    "device_id",
                    "theme",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "theme",
        "created",
    )

    readonly_fields = f_admin.readonly_fields + ("device_id",)


@admin.register(log_models.EncodingLog)
class EncodingLogAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (_("사용자 기록"), {"fields": ("device_id",)}),
        (
            _("원본 기록"),
            {
                "fields": (
                    "resource_type",
                    "src_duration",
                )
            },
        ),
        (
            _("편집 기록"),
            {
                "fields": (
                    "dst_duration",
                    "bg_color_div",
                    "bg_color",
                    "is_cut",
                    "is_boomerang",
                    "frame_type",
                    "template",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "resource_type",
        "src_duration",
        "dst_duration",
        "bg_color_div",
        "frame_type",
        "template",
        "is_cut",
        "is_boomerang",
        "created",
    )

    readonly_fields = f_admin.readonly_fields + (
        "bg_color_div",
        "device_id",
    )

    def bg_color_div(self, obj):
        return mark_safe(
            f"<div style='width:50px; height:50px; background-color:{obj.bg_color};'/>"
        )

    bg_color_div.short_description = _("배경색")
