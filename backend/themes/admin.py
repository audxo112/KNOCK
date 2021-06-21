from datetime import timedelta
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.contrib import admin
from django.utils import timezone
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from themes import models as theme_models
from core import admin as core_admin
from core.admin import FleetAdmin as f_admin


class ThumbnailImageWidget(core_admin.AdminImageWidget):
    width = 85
    height = 150


class ThumbnailInline(admin.StackedInline):
    model = theme_models.ThemeThumbnail
    verbose_name = "썸네일"
    verbose_name_plural = "썸네일"
    extra = 1
    max_num = 1
    fields = (
        "image_size_type",
        "image",
        "theme",
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
    model = theme_models.ThemeContent
    verbose_name = "컨텐츠"
    verbose_name_plural = "컨텐츠"
    extra = 1
    max_num = 2
    fields = (
        "screen_size",
        "preload",
        "content",
        "theme",
    )
    readonly_fields = (
        "screen_size",
        "updated",
        "created",
    )
    formfield_overrides = {models.ImageField: {"widget": ContentImageWidget}}


# class ObtainInline(admin.TabularInline):
#     model = theme_models.ThemeObtain
#     verbose_name = _("획득방법")
#     verbose_name_plural = _("획득방법")
#     extra = 1
#     fields = (
#         "method",
#         "price",
#         "date_of_provision",
#         "theme",
#     )
#     readonly_fields = (
#         "updated",
#         "created",
#     )


@admin.register(theme_models.Theme)
class ThemeAdmain(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("테마"),
            {
                "fields": (
                    "title",
                    "link",
                    "tags",
                )
            },
        ),
        (
            _("게시 정보"),
            {
                "fields": (
                    "is_verified",
                    "is_confirm",
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
        "like_count",
        "applying_count",
        "applied_count",
        "is_verified",
        "is_confirm",
        "is_pending",
        "updated",
        "created",
    )

    list_display_links = ("thumbnail_image", "title")

    inlines = (
        # ObtainInline,
        ThumbnailInline,
        ContentInline,
    )

    filter_horizontal = ("tags",)

    readonly_fields = f_admin.readonly_fields + ("thumbnail_image",)

    def thumbnail_image(self, obj):
        try:
            thumbnail = obj.thumbnails.filter(
                image_size_type=theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_MINI
            )
            if not thumbnail.exists():
                thumbnail = obj.thumbnails.filter(
                    image_size_type=theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_DEFAULT
                )
            thumbnail = thumbnail.first()
            url = thumbnail.image.url
        except AttributeError:
            url = ""
        return mark_safe(
            f"<img src={url} width='85px' height='150px' style='object-fit:cover;'/>"
        )

    thumbnail_image.short_description = _("썸네일 이미지")

    def owner_nickname(self, obj):
        return obj.owner.nickname

    owner_nickname.short_description = _("소유자")

    def like_count(self, obj):
        return obj.likes.count()

    like_count.short_description = _("좋아요수")

    def applying_count(self, obj):
        # yesterday = timezone.now() - timedelta(days=1)
        # return obj.appling_logs.filter(
        #     created__year=yesterday.year,
        #     created__month=yesterday.month,
        #     created__date=yesterday.day,
        # ).count()
        return 0

    applying_count.short_description = _("어제적용수")

    def applied_count(self, obj):
        return obj.applied_logs.count()

    applied_count.short_description = _("누적적용수")


@admin.register(theme_models.ThemeTag)
class ThemeTagAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("태그"),
            {"fields": ("tag",)},
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "tag",
        "using_count",
        "updated",
        "created",
    )

    def using_count(self, obj):
        return obj.themes.count()

    using_count.short_description = _("사용중 갯수")


@admin.register(theme_models.ThemeThumbnail)
class ThemeThumbnailAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("썸네일"),
            {
                "fields": (
                    "thumbnail_image",
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
                    "theme",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "thumbnail_image",
        "theme_title",
        "image_size_type",
        "image_type",
        "thumbnail_size",
        "updated",
        "created",
    )

    list_display_links = (
        "thumbnail_image",
        "theme_title",
    )

    def theme_title(self, obj):
        return obj.theme.title

    theme_title.short_description = _("테마")

    readonly_fields = f_admin.readonly_fields + (
        "thumbnail_image",
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

    def thumbnail_size(self, obj):
        return f"{obj.width}x{obj.height}"

    thumbnail_size.short_description = _("썸네일 크기")


@admin.register(theme_models.ThemeContent)
class ThemeContentAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("컨텐츠"),
            {
                "fields": (
                    "content_player",
                    "content",
                    "content_type",
                )
            },
        ),
        (
            _("프리로드"),
            {
                "fields": (
                    "preload_image",
                    "preload",
                    "preload_type",
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
                    "theme",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "preload_image",
        "theme_title",
        "screen_size",
        "preload_type",
        "content_type",
        "content_size",
        "updated",
        "created",
    )

    list_display_links = (
        "preload_image",
        "theme_title",
    )

    def theme_title(self, obj):
        return obj.theme.title

    theme_title.short_description = _("테마")

    readonly_fields = f_admin.readonly_fields + (
        "screen_size",
        "width",
        "height",
        "preload_image",
        "preload_type",
        "preload",
        "content_player",
        "content_type",
        "content",
    )

    def preload_image(self, obj):
        try:
            url = obj.preload.url
        except ValueError:
            url = ""

        width = 85
        height = width * obj.height / obj.width

        return mark_safe(
            f"<img src={url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
        )

    preload_image.short_description = _("프리로드 이미지")

    def content_player(self, obj):
        try:
            url = obj.content.url
        except ValueError:
            url = ""

        width = 170
        height = width * obj.height / obj.width

        if "image" in obj.content_type:
            return mark_safe(
                f"<img src={url} width='{width}px' height='{height}px' style='object-fit:cover;'/>"
            )
        elif "video" in obj.content_type:
            return mark_safe(
                f"<video src={url} width='{width}px' height='{height}px' autoplay muted='muted' controls loop style='object-fit:cover;'/>"
            )
        return ""

    content_player.short_description = _("컨텐츠")

    def content_size(self, obj):
        return f"{obj.width}x{obj.height}"

    content_size.short_description = _("컨텐츠 크기")
