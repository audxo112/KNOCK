from django.db import models
from django.utils.translation import gettext_lazy as _
from core import models as core_models
from . import managers


class ThemeFrame(core_models.FleetRandomIDModels):
    SCALE_TYPE_SCALE = "scale"
    SCALE_TYPE_CROP = "crop"

    SCALE_TYPE_CHOICES = (
        (SCALE_TYPE_SCALE, _("늘이기")),
        (SCALE_TYPE_CROP, _("크롭")),
    )

    REPEAT_MODE_NONE = "none"
    REPEAT_MODE_LOOP = "loop"
    REPEAT_MODE_SYNC = "sync"
    REPEAT_MODE_ONE_STOP = "stop"
    REPEAT_MODE_ONE_TIME = "one_time"

    REPEAT_MODE_CHOICES = (
        (REPEAT_MODE_NONE, _("없음")),
        (REPEAT_MODE_LOOP, _("반복")),
        (REPEAT_MODE_SYNC, _("영상과 동기화")),
        (REPEAT_MODE_ONE_STOP, _("한번 실행후 정지")),
        (REPEAT_MODE_ONE_TIME, _("한번 실행후 사라짐")),
    )

    title = models.CharField(_("제목"), max_length=50)

    is_verified = models.BooleanField(
        _("검증 여부"),
        default=False,
        help_text=_("에디터가 검증한 여부, 에디터가 올린 프레임은 기본값 True"),
    )
    is_pending = models.BooleanField(
        _("보류 여부"),
        default=False,
        help_text=_("신고등의 이유로 게시가 보류가 됬는지 여부"),
    )
    is_public = models.BooleanField(
        _("공개 여부"),
        default=False,
        help_text=_("신고등의 이유로 게시가 보류가 됬는지 여부"),
    )

    dominant_color = models.CharField(_("대표색"), max_length=7, default="#000000")

    scale_type = models.CharField(
        _("스케일 타입"),
        choices=SCALE_TYPE_CHOICES,
        max_length=15,
        blank=True,
        default=SCALE_TYPE_SCALE,
    )

    repeat_mode = models.CharField(
        _("반복 모드"),
        choices=REPEAT_MODE_CHOICES,
        max_length=15,
        blank=True,
        default=REPEAT_MODE_NONE,
    )

    priority = models.PositiveIntegerField(
        _("우선순위"),
        blank=True,
        default=0,
    )

    order = models.PositiveIntegerField(
        _("순서"),
        default=1,
    )

    price = models.PositiveIntegerField(
        _("가격"),
        default=0,
    )

    owner = models.ForeignKey(
        "users.User",
        related_name="frames",
        on_delete=models.CASCADE,
        verbose_name=_("소유자"),
    )

    objects = managers.FrameManager()

    class Meta:
        verbose_name = _("테마 프레임")
        verbose_name_plural = _("테마 프레임")

    def __str__(self):
        return f"{self.title}"

    def save(self, *args, **kwargs):
        if not self.id:
            try:
                top = ThemeFrame.objects.order_by("-order")[0]
                self.order = top.order + 1
            except IndexError:
                self.order = 1

        super(ThemeFrame, self).save(*args, **kwargs)


class ThemeFrameThumbnail(core_models.FleetThumbnailModels):
    frame = models.ForeignKey(
        "frames.ThemeFrame",
        related_name="thumbnails",
        on_delete=models.CASCADE,
        verbose_name=_("프레임"),
    )

    objects = managers.ThumbnailManager()

    class Meta:
        verbose_name = _("테마 프레임 썸네일")
        verbose_name_plural = _("테마 프레임 썸네일")

    def __str__(self):
        return f"{self.id}"

    def get_dir(self):
        return f"{self.frame.get_dir()}/thumbnail/{self.image_size_type}"


class ThemeFrameContent(core_models.FleetContentModels):
    frame = models.ForeignKey(
        "frames.ThemeFrame",
        related_name="contents",
        on_delete=models.CASCADE,
        verbose_name=_("프레임"),
    )

    objects = managers.ContentManager()

    class Meta:
        verbose_name = _("테마 프레임 컨텐츠")
        verbose_name_plural = _("테마 프레임 컨텐츠")

    def __str__(self):
        return f"{self.id}"

    def get_dir(self):
        return self.frame.get_dir()
