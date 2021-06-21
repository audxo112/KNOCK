from django.db import models
from django.utils.translation import gettext_lazy as _
from core import models as core_models


class AppliedThemeLog(core_models.FleetModels):
    device_id = models.CharField(
        _("디바이스 ID"),
        max_length=50,
        editable=False,
    )

    theme = models.ForeignKey(
        "themes.Theme",
        related_name="applied_logs",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )

    class Meta:
        verbose_name = _("테마 적용 기록")
        verbose_name_plural = _("테마 적용 기록")

    def __str__(self):
        return "Applied Theme Log"


class ApplingThemeLog(core_models.FleetModels):
    device_id = models.CharField(
        _("디바이스 ID"),
        max_length=50,
        editable=False,
    )

    theme = models.ForeignKey(
        "themes.Theme",
        related_name="appling_logs",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )

    class Meta:
        verbose_name = _("적용중인 테마 기록")
        verbose_name_plural = _("적용중인 테마 기록")

    def __str__(self):
        return "Appling Theme Log"


class EnterThemeLinkLog(core_models.FleetModels):
    device_id = models.CharField(
        _("디바이스 ID"),
        max_length=50,
        editable=False,
    )

    theme = models.ForeignKey(
        "themes.Theme",
        related_name="enter_link_logs",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )

    class Meta:
        verbose_name = _("테마 링크 사용 기록")
        verbose_name_plural = _("테마 링크 사용 기록")

    def __str__(self):
        return "Enter Link Log"


class EncodingLog(core_models.FleetModels):
    RESOURCE_TYPE_GIF = "gif"
    RESOURCE_TYPE_VIDEO = "video"

    RESOURCE_TYPE_CHOICES = (
        (RESOURCE_TYPE_GIF, "GIF"),
        (RESOURCE_TYPE_VIDEO, "비디오"),
    )

    FRAME_TYPE_BASE = "base"
    FRAME_TYPE_TEMPLATE = "template"

    FRAME_TYPE_CHOICES = (
        (FRAME_TYPE_BASE, "기본"),
        (FRAME_TYPE_TEMPLATE, "템플릿"),
    )

    device_id = models.CharField(
        _("디바이스 ID"),
        max_length=50,
        editable=False,
    )

    resource_type = models.CharField(
        _("리소스 종류"),
        choices=RESOURCE_TYPE_CHOICES,
        max_length=10,
        default=RESOURCE_TYPE_VIDEO,
    )

    src_duration = models.IntegerField(_("원본영상길이"), default=0)
    dst_duration = models.IntegerField(_("편집영상길이"), default=0)
    frame_type = models.CharField(
        _("프레임 종류"),
        choices=FRAME_TYPE_CHOICES,
        max_length=15,
        default=FRAME_TYPE_BASE,
    )
    template = models.ForeignKey(
        "frames.ThemeFrame",
        related_name="encoding_logs",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name=_("템플릿"),
    )

    is_cut = models.BooleanField(
        _("자르기 여부"),
        default=False,
    )
    is_boomerang = models.BooleanField(
        _("부메랑 여부"),
        default=False,
    )
    bg_color = models.CharField(
        _("배경색"),
        max_length=7,
        default="#000000",
    )

    class Meta:
        verbose_name = _("인코딩 기록")
        verbose_name_plural = _("인코딩 기록")

    def __str__(self):
        return f"{self.id}"
