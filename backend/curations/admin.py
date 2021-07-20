from django.db import models
from django.contrib import admin
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from . import models as curation_models
from core import admin as core_admin
from core.admin import FleetAdmin as f_admin


class FolderCoverImageWidge(core_admin.AdminImageWidget):
    width = 450
    height = 150


class FolderCoverInline(admin.StackedInline):
    model = curation_models.ThemeCurationFolderCover
    verbose_name = "폴더 커버"
    verbose_name_plural = "폴더 커버"
    extra = 1
    fields = (
        "image",
        "width",
        "height",
        "image_type",
        "folder",
    )
    readonly_fields = (
        "width",
        "height",
        "image_type",
        "updated",
        "created",
    )
    formfield_overrides = {models.ImageField: {"widget": FolderCoverImageWidge}}


@admin.register(curation_models.ThemeCurationGroup)
class ThemeCurationGroupAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("큐레이션 그룹"),
            {
                "fields": (
                    "title",
                    "view_type",
                    "post_start_datetime",
                    "post_end_datetime",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "title",
        "order",
        "view_type",
        "folder_count",
    )

    def folder_count(self, obj):
        return obj.folders.count()

    folder_count.short_description = _("폴더수")


@admin.register(curation_models.ThemeCurationFolder)
class ThemeCurationFolderAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("큐레이션 폴더"),
            {
                "fields": (
                    "title",
                    "sub_title",
                    "description",
                    "dominant_color",
                    "order",
                    "group",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "cover_image",
        "title",
        "sub_title",
        "order",
        "theme_count",
    )

    list_display_links = (
        "cover_image",
        "title",
    )

    inlines = (FolderCoverInline,)

    ordering = ("-order",)

    def cover_image(self, obj):
        if obj.covers.count() == 0:
            return ""

        cover = obj.covers.all()[0]
        height = 150
        width = cover.width / cover.height * height

        return mark_safe(
            f"<img src={cover.image.url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    cover_image.short_description = _("폴더 이미지")

    def theme_count(self, obj):
        return obj.lists.count()

    theme_count.short_description = _("테마수")


@admin.register(curation_models.ThemeCurationFolderCover)
class ThemeCurationFolderCoverAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("커버"),
            {
                "fields": (
                    "cover_image",
                    "image",
                    "image_type",
                    "width",
                    "height",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    readonly_fields = f_admin.readonly_fields + (
        "cover_image",
        "width",
        "height",
        "image_type",
    )

    list_display = (
        "cover_image",
        "folder_title",
        "image_type",
        "cover_ratio",
    )

    list_display_links = (
        "cover_image",
        "folder_title",
    )

    def cover_image(self, obj):
        height = 150
        width = obj.width / obj.height * height

        return mark_safe(
            f"<img src={obj.image.url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    cover_image.short_description = "커버 이미지"

    def folder_title(self, obj):
        return obj.folder.title

    folder_title.short_description = "폴더 제목"

    def cover_ratio(self, obj):
        return f"{obj.width}:{obj.height}"

    cover_ratio.short_description = "커버 비율"
