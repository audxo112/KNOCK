from django.db import models
from django.contrib import admin
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from . import models as frame_models
from core import admin as core_admin
from core.admin import FleetAdmin as f_admin


class ThumbnailImageWidget(core_admin.AdminImageWidget):
    width = 85
    height = 150


class ThumbnailInline(admin.StackedInline):
    model = frame_models.ThemeFrameThumbnail
    verbose_name = "썸네일"
    verbose_name_plural = "썸네일"
    extra = 1
    max_num = 1
    fields = (
        "image_size_type",
        "image",
        "frame",
    )
    readonly_fields = (
        "image_size_type",
        "updated",
        "created",
    )
    formfield_overrides = {models.ImageField: {"widget": ThumbnailImageWidget}}


class ContentImageWidget(core_admin.AdminImageWidget):
    width = 85
    height = 150


class ContentInline(admin.StackedInline):
    model = frame_models.ThemeFrameContent
    verbose_name = "컨텐츠"
    verbose_name_plural = "컨텐츠"
    extra = 1
    max_num = 1
    fields = (
        "screen_size",
        "content",
        "frame",
    )
    readonly_fields = (
        "screen_size",
        "updated",
        "created",
    )
    formfield_overrides = {models.ImageField: {"widget": ContentImageWidget}}


@admin.register(frame_models.ThemeFrame)
class ThemeFrameAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("프레임"),
            {
                "fields": (
                    "title",
                    "scale_type",
                    "repeat_mode",
                    "priority",
                    "order",
                )
            },
        ),
        (
            _("게시 정보"),
            {
                "fields": (
                    "is_verified",
                    "is_pending",
                    "post_start_datetime",
                    "post_end_datetime",
                )
            },
        ),
        (
            _("관계 정보"),
            {"fields": ("owner",)},
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "thumbnail_image",
        "title",
        "owner_nickname",
        "frame_type",
        "scale_type",
        "repeat_mode",
        "priority",
        "order",
        "is_verified",
        "is_pending",
        "updated",
        "created",
    )

    list_display_links = (
        "thumbnail_image",
        "title",
    )

    inlines = (
        ThumbnailInline,
        ContentInline,
    )

    readonly_fields = f_admin.readonly_fields + (
        "thumbnail_image",
        "order",
    )

    def frame_type(self, obj):
        try:
            if not obj.contents.exists():
                return ""

            content = obj.contents.first()
            return content.content_type
        except AttributeError:
            return ""

    frame_type.short_description = _("프레임 타입")

    def owner_nickname(self, obj):
        return obj.owner.nickname

    owner_nickname.short_description = _("소유자")

    def thumbnail_image(self, obj):
        width = 85
        height = 150
        try:
            thumbnail = obj.thumbnails.filter(
                image_size_type=frame_models.ThemeFrameThumbnail.IMAGE_SIZE_TYPE_MINI
            )
            print(thumbnail)
            if not thumbnail.exists():
                thumbnail = obj.thumbnails.filter(
                    image_size_type=frame_models.ThemeFrameThumbnail.IMAGE_SIZE_TYPE_DEFAULT
                )
            thumbnail = thumbnail.first()
            url = thumbnail.image.url
            height = width * thumbnail.height / thumbnail.width
        except AttributeError:
            print("error")
            url = ""
        return mark_safe(
            f"<img src={url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    thumbnail_image.short_description = _("썸네일 이미지")


@admin.register(frame_models.ThemeFrameThumbnail)
class ThemeFrameThumbnailAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("썸네일"),
            {
                "fields": (
                    "large_thumbnail_image",
                    "image",
                    "image_type",
                )
            },
        ),
        (
            _("상세정보"),
            {
                "fields": (
                    "image_size_type",
                    "width",
                    "height",
                    "frame",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "thumbnail_image",
        "frame_title",
        "image_size_type",
        "image_type",
        "thumbnail_size",
        "updated",
        "created",
    )

    list_display_links = (
        "thumbnail_image",
        "frame_title",
    )

    def frame_title(self, obj):
        return obj.frame.title

    frame_title.short_description = _("프레임")

    readonly_fields = f_admin.readonly_fields + (
        "thumbnail_image",
        "large_thumbnail_image",
        "image_size_type",
        "image",
        "image_type",
        "width",
        "height",
    )

    def thumbnail_image(self, obj):
        try:
            url = obj.image.url
        except ValueError:
            url = ""

        width = 85
        height = width * obj.height / obj.width

        return mark_safe(
            f"<img src={url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    thumbnail_image.short_description = _("썸네일 이미지")

    def large_thumbnail_image(self, obj):
        try:
            url = obj.image.url
        except ValueError:
            url = ""

        width = 170
        height = width * obj.height / obj.width

        return mark_safe(
            f"<img src={url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    large_thumbnail_image.short_description = _("썸네일")

    def thumbnail_size(self, obj):
        return f"{obj.width}x{obj.height}"

    thumbnail_size.short_description = _("썸네일 크기")


@admin.register(frame_models.ThemeFrameContent)
class ThemeFrameContentAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("컨텐츠"),
            {
                "fields": (
                    "content_image",
                    "content",
                    "content_type",
                )
            },
        ),
        (
            _("상세정보"),
            {
                "fields": (
                    "screen_size",
                    "width",
                    "height",
                    "frame",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "content_thumbnail",
        "frame_title",
        "screen_size",
        "content_type",
        "content_size",
        "updated",
        "created",
    )

    list_display_links = (
        "content_thumbnail",
        "frame_title",
    )

    def frame_title(self, obj):
        return obj.frame.title

    frame_title.short_description = _("프레임")

    readonly_fields = f_admin.readonly_fields + (
        "screen_size",
        "width",
        "height",
        "content_thumbnail",
        "content_image",
        "content_type",
        "content",
    )

    def content_thumbnail(self, obj):
        try:
            url = obj.content.url
        except ValueError:
            url = ""

        width = 85
        height = width * obj.height / obj.width

        return mark_safe(
            f"<img src={url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    content_thumbnail.short_description = _("컨텐츠 썸네일")

    def content_image(self, obj):
        try:
            url = obj.content.url
        except ValueError:
            url = ""

        width = 170
        height = width * obj.height / obj.width

        return mark_safe(
            f"<img src={url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    content_image.short_description = _("컨텐츠")

    def content_size(self, obj):
        return f"{obj.width}x{obj.height}"

    content_size.short_description = _("컨텐츠 크기")
