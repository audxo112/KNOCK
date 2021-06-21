import os
import shutil
import datetime
from uuid import uuid4
from django.db import models
from django.db.utils import IntegrityError
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from . import managers, storages


default_end_date = datetime.datetime(2071, 5, 22, 9, 0, 0, 0)


def create_random_string(length=20):
    return uuid4().hex[:length].upper()


class FleetModels(models.Model):
    id = models.AutoField(primary_key=True)

    created = models.DateTimeField(_("생성 된 시간"), editable=False)
    updated = models.DateTimeField(_("최근 업데이트 시간"))

    objects = managers.CustomManager()

    class Meta:
        abstract = True

    def get_model_name(self):
        return f"{self.__class__.__name__.lower()}s"

    def get_dir(self):
        return f"{self.get_model_name()}/{self.id}"

    def created_to_string(self):
        return f"{self.created.strftime('%Y%m%d-%H%M%S')}"

    def save(self, *args, **kwargs):
        self.updated = timezone.now()
        if not self.created:
            self.created = timezone.now()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        path = settings.MEDIA_ROOT / self.get_dir()
        try:
            if os.path.isfile(path):
                os.remove(path)
            elif os.path.isdir(path):
                shutil.rmtree(path)
        except FileNotFoundError:
            pass
        super().delete(*args, **kwargs)


class FleetRandomIDModels(FleetModels):
    id = models.CharField(primary_key=True, max_length=20, editable=False)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):

        if self.id:
            super().save(*args, **kwargs)
            return

        unique = False

        while not unique:
            try:
                self.id = create_random_string()
                super().save(*args, **kwargs)
            except IntegrityError:
                pass
            else:
                unique = True


class FleetOrderedModels(FleetModels):
    order = models.PositiveIntegerField(
        _("순서"),
        default=1,
    )

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.id:
            try:
                top = self.objects.order_by("-order")[0]
                self.order = top.order + 1
            except IndexError:
                self.order = 1

        super(FleetOrderedModels, self).save(*args, **kwargs)


def fleet_thumbnail_path(instance, filename):
    ext = filename.split(".")[-1].lower()
    new_filename = f"{instance.created_to_string()}.{ext}"
    return f"{instance.get_dir()}/{new_filename}"


class FleetThumbnailModels(FleetModels):
    IMAGE_SIZE_TYPE_ORIGIN = "origin"
    IMAGE_SIZE_TYPE_DEFAULT = "default"
    IMAGE_SIZE_TYPE_MINI = "mini"
    IMAGE_SIZE_TYPE_MICRO = "micro"

    IMAGE_SIZE_TYPE_CHOICES = (
        (IMAGE_SIZE_TYPE_DEFAULT, _("기본")),
        (IMAGE_SIZE_TYPE_ORIGIN, _("원본")),
        (IMAGE_SIZE_TYPE_MINI, _("작은")),
        (IMAGE_SIZE_TYPE_MICRO, _("아주 작은")),
    )

    image_size_type = models.CharField(
        _("이미지 크기 종류"),
        choices=IMAGE_SIZE_TYPE_CHOICES,
        max_length=10,
        default=IMAGE_SIZE_TYPE_DEFAULT,
    )

    image = models.ImageField(
        _("썸네일"),
        upload_to=fleet_thumbnail_path,
        storage=storages.OverwriteStorage(),
    )

    image_type = models.CharField(
        _("이미지 형식"),
        max_length=20,
        default="image",
    )

    width = models.PositiveIntegerField(
        _("가로"),
        default=0,
    )

    height = models.PositiveIntegerField(
        _("세로"),
        default=0,
    )

    class Meta:
        abstract = True


def fleet_content_path(instance, filename):
    dir = f"{instance.get_dir()}/content/{instance.screen_size}"
    ext = filename.split(".")[-1].lower()
    new_filename = f"{instance.created_to_string()}.{ext}"
    return f"{dir}/{new_filename}"


class FleetContentModels(FleetModels):
    SCREEN_SIZE_NORMAL = "normal"
    SCREEN_SIZE_LARGE = "large"

    SCREEN_SIZE_CHOICES = (
        (SCREEN_SIZE_NORMAL, _("일반")),
        (SCREEN_SIZE_LARGE, _("큰")),
    )

    screen_size = models.CharField(
        _("화면크기"),
        choices=SCREEN_SIZE_CHOICES,
        max_length=10,
        default=SCREEN_SIZE_NORMAL,
    )

    content = models.FileField(
        _("컨텐츠"),
        upload_to=fleet_content_path,
        storage=storages.OverwriteStorage(),
    )

    content_type = models.CharField(
        _("컨텐츠 형식"),
        max_length=20,
        default="",
    )

    width = models.PositiveIntegerField(
        _("가로"),
        default=0,
    )

    height = models.PositiveIntegerField(
        _("세로"),
        default=0,
    )

    class Meta:
        abstract = True


def fleet_preload_path(instance, filename):
    dir = f"{instance.get_dir()}/preload/{instance.screen_size}"
    ext = filename.split(".")[-1].lower()
    new_filename = f"{instance.created_to_string()}.{ext}"
    return f"{dir}/{new_filename}"


class FleetPreloadContentModels(FleetContentModels):
    preload = models.ImageField(
        _("프리로드"),
        upload_to=fleet_preload_path,
        storage=storages.OverwriteStorage(),
    )

    preload_type = models.CharField(
        _("프리로드 형식"),
        max_length=20,
        default="",
    )

    class Meta:
        abstract = True


class FleetUserModels(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(primary_key=True, max_length=20, editable=False)

    username = models.CharField(
        _("아이디"),
        max_length=25,
        unique=True,
        help_text=_(
            "Required. 25 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[UnicodeUsernameValidator()],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )

    nickname_value = models.CharField(
        _("닉네임 값"),
        unique=True,
        max_length=16,
        default="",
    )

    nickname = models.CharField(
        _("닉네임"),
        unique=True,
        max_length=16,
    )

    email = models.EmailField(_("email address"), blank=True, default="")

    is_staff = models.BooleanField(
        _("스태프 여부"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("활성 여부"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )

    created = models.DateTimeField(_("가입한 시간"), editable=False)
    updated = models.DateTimeField(_("최근 업데이트 시간"))

    objects = managers.CustomUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"

    class Meta:
        abstract = True

    def get_model_name(self):
        return f"{self.__class__.__name__.lower()}s"

    def get_dir(self):
        return f"{self.get_model_name()}/{self.id}"

    def created_to_string(self):
        return f"{self.created.strftime('%Y%m%d-%H%M%S')}"

    def save(self, *args, **kwargs):
        self.updated = timezone.now()
        if self.id:
            nickname = kwargs.pop("nickname", self.nickname)
            self.nickname_value = nickname.lower()
            super(FleetUserModels, self).save(*args, **kwargs)
        else:
            self.created = timezone.now()
            unique = False
            while not unique:
                try:
                    self.id = create_random_string()

                    nickname = kwargs.pop("nickname", self.nickname)
                    if nickname == "":
                        nickname = "User_" + create_random_string()[:10]
                    self.nickname = nickname
                    self.nickname_value = nickname.lower()

                    username = kwargs.pop("username", self.username)
                    if username == "":
                        username = create_random_string()
                    self.username = username

                    self.login_token = create_random_string()[:16]
                    super(FleetUserModels, self).save(*args, **kwargs)
                except IntegrityError:
                    pass
                else:
                    unique = True

    def delete(self, *args, **kwargs):
        path = settings.MEDIA_ROOT / self.get_dir()
        try:
            if os.path.isfile(path):
                os.remove(path)
            elif os.path.isdir(path):
                shutil.rmtree(path)
        except FileNotFoundError:
            pass
        super(FleetUserModels, self).delete(*args, **kwargs)
