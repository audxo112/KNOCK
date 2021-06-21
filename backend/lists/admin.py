from django.contrib import admin
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from . import models as list_models
from themes import models as theme_models
from core import admin as core_admin
from core.admin import FleetAdmin as f_admin


@admin.register(list_models.ThemeList)
class ThemeListAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("정보"),
            {
                "fields": (
                    "theme",
                    "group",
                    "folder",
                    "order",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "thumbnail_image",
        "theme_title",
        "group_title",
        "folder_title",
        "order",
        "created",
    )

    readonly_fields = f_admin.readonly_fields + (
        "order",
        "thumbnail_image",
    )

    def thumbnail_image(self, obj):
        width = 85
        height = 150
        try:
            thumbnail = obj.theme.thumbnails.filter(
                image_size_type=theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_MINI
            )
            if not thumbnail.exists():
                thumbnail = obj.theme.thumbnails.filter(
                    image_size_type=theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_DEFAULT
                )
            thumbnail = thumbnail.first()
            url = thumbnail.image.url
            height = width * thumbnail.height / thumbnail.width
        except AttributeError:
            url = ""
        return mark_safe(
            f"<img src={url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    thumbnail_image.short_description = _("썸네일 이미지")

    def theme_title(self, obj):
        return obj.theme.title

    theme_title.short_description = _("테마 제목")

    def group_title(self, obj):
        return obj.group.title

    group_title.short_description = _("그룹 제목")

    def folder_title(self, obj):
        return obj.folder.title

    folder_title.short_description = _("폴더 제목")
