from django.db.models import Q
from django.db import models
from django.contrib import admin
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from . import models as user_models
from core import admin as core_admin
from core.admin import FleetAdmin as f_admin, FleetUserAdmin as fu_admin


class AvatarInline(admin.TabularInline):
    model = user_models.Avatar
    verbose_name = "프로필 사진"
    verbose_name_plural = "프로필 사진"
    extra = 1
    fields = (
        "image_size_type",
        "image",
        "image_size",
        "updated",
        "created",
    )
    readonly_fields = (
        "updated",
        "created",
        "image_size",
    )
    formfield_overrides = {models.ImageField: {"widget": core_admin.AdminImageWidget}}

    def image_size(self, obj):
        return f"{obj.width}x{obj.height}"

    image_size.short_description = _("프로필 크기")


@admin.register(user_models.User)
class UserAdmin(core_admin.FleetUserAdmin):
    fieldsets = (
        (
            _("계정"),
            {
                "fields": (
                    "username",
                    "change_password",
                    "nickname",
                    "nickname_value",
                    "order",
                    "email",
                    "grade",
                    "login_method",
                ),
            },
        ),
        (
            _("게시 정보"),
            {
                "fields": (
                    "is_editor",
                    "is_usable_editor",
                    "is_verified",
                    "is_visibility",
                    "upload_stop_period",
                )
            },
        ),
        (
            _("인증"),
            {
                "fields": (
                    "fcm_token",
                    "login_token",
                ),
            },
        ),
        (
            _("Permissions"),
            {
                "classes": ("collapse",),
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        fu_admin.important_dates_fieldset,
    )

    readonly_fields = fu_admin.readonly_fields + (
        "change_password",
        "nickname_value",
        "fcm_token",
        "login_token",
    )

    list_display = (
        "avatar_image",
        "username",
        "nickname",
        "email",
        "grade",
        "login_method",
        "order",
        "is_editor",
        "is_usable_editor",
        "is_verified",
        "is_visibility",
        "last_login",
    )
    list_display_links = (
        "avatar_image",
        "username",
    )
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("username",)
    filter_horizontal = (
        "groups",
        "user_permissions",
    )

    inlines = (AvatarInline,)

    def change_password(self, obj):
        return mark_safe("<a href='../password/'>비밀번호 변경</a>")

    change_password.short_description = _("비밀번호")

    def avatar_image(self, obj):
        try:
            avatar = obj.avatars.filter(
                image_size_type=user_models.Avatar.IMAGE_SIZE_TYPE_MINI
            )
            if not avatar.exists():
                avatar = obj.avatars.filter(
                    image_size_type=user_models.Avatar.IMAGE_SIZE_TYPE_DEFAULT
                )
            avatar = avatar.first()
            url = avatar.image.url
        except AttributeError:
            url = ""
        return mark_safe(
            f"<img src={url} width='100px' height='100px' style='object-fit:cover;'/>"
        )

    avatar_image.short_description = _("프로필 이미지")


@admin.register(user_models.Avatar)
class AvatarAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("프로필 이미지"),
            {
                "fields": (
                    "avatar_image",
                    "image",
                    "image_size_type",
                    "width",
                    "height",
                    "user",
                ),
            },
        ),
        f_admin.important_dates_fieldset,
    )

    readonly_fields = f_admin.readonly_fields + ("avatar_image",)

    list_display = (
        "avatar_image",
        "user_nickname",
        "image_size_type",
        "updated",
        "created",
    )

    list_display_links = (
        "avatar_image",
        "user_nickname",
    )

    list_filter = ("image_size_type",)

    def avatar_image(self, obj):
        return mark_safe(
            f"<img src={obj.image.url} width='100px' height='100px' style='object-fit:cover;'/>"
        )

    avatar_image.short_description = _("프로필 이미지")

    def user_nickname(self, obj):
        return obj.user.nickname

    user_nickname.short_description = _("유저 닉네임")


@admin.register(user_models.BanNickname)
class BanNicknameAdmin(core_admin.FleetAdmin):
    fieldsets = (
        (
            _("금지 닉네임"),
            {
                "fields": (
                    "nickname",
                    "value",
                )
            },
        ),
        f_admin.important_dates_fieldset,
    )

    list_display = (
        "nickname",
        "updated",
        "created",
    )

    readonly_fields = (
        "value",
        "updated",
        "created",
    )
