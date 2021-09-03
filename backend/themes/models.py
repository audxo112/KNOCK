from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from core import models as core_models
from . import managers


class Theme(core_models.FleetRandomIDModels):

    title = models.CharField(_("제목"), max_length=50)
    link = models.URLField(_("링크"), max_length=300, blank=True)
    is_allow_download = models.BooleanField(
        _("다운로드허용"),
        default=False,
        help_text=_("에디터가 검증한 여부, 에디터가 올린 테마는 기본값 True"),
    )
    is_verified = models.BooleanField(
        _("검증 여부"),
        default=False,
        help_text=_("에디터가 검증한 여부, 에디터가 올린 테마는 기본값 True"),
    )
    is_pending = models.BooleanField(
        _("보류 여부"),
        default=False,
        help_text=_("신고등의 이유로 게시가 보류가 됬는지 여부"),
    )
    is_public = models.BooleanField(
        _("공개 여부"),
        default=True,
        help_text=_("신고등의 이유로 게시가 보류가 됬는지 여부"),
    )

    dominant_color = models.CharField(_("대표색"), max_length=7, default="#000000")

    post_start_datetime = models.DateTimeField(
        _("게시 시작일"),
        default=timezone.now,
    )

    post_end_datetime = models.DateTimeField(
        _("게시 종료일"),
        default=core_models.default_end_date,
    )

    price = models.PositiveIntegerField(
        _("가격"),
        default=0,
    )

    tags = models.ManyToManyField(
        "themes.ThemeTag",
        related_name="themes",
        blank=True,
        verbose_name=_("태그"),
    )

    owner = models.ForeignKey(
        "users.User",
        related_name="themes",
        on_delete=models.CASCADE,
        verbose_name=_("소유자"),
    )

    objects = managers.ThemeManager()

    class Meta:
        verbose_name = _("테마")
        verbose_name_plural = _("테마")

    def __str__(self):
        return self.title


class ThemeTag(core_models.FleetModels):
    tag = models.CharField(_("태그"), max_length=20)

    objects = managers.TagManger()

    class Meta:
        verbose_name = _("테마 태그")
        verbose_name_plural = _("테마 태그")

    def __str__(self):
        return self.tag


class ThemeThumbnail(core_models.FleetThumbnailModels):
    theme = models.ForeignKey(
        "themes.Theme",
        related_name="thumbnails",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )

    objects = managers.ThumbnailManager()

    class Meta:
        verbose_name = _("테마 썸네일")
        verbose_name_plural = _("테마 썸네일")

    def __str__(self):
        return f"{self.id}"

    def get_dir(self):
        return f"{self.theme.get_dir()}/thumbnail/{self.image_size_type}"


class ThemeContent(core_models.FleetPreloadContentModels):
    theme = models.ForeignKey(
        Theme,
        related_name="contents",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )

    objects = managers.ContentManager()

    class Meta:
        verbose_name = _("테마 컨텐츠")
        verbose_name_plural = _("테마 컨텐츠")

    def __str__(self):
        return f"{self.id}"

    def get_dir(self):
        return self.theme.get_dir()


# class ThemeObtain(core_models.FleetModels):
#     OBTAIN_METHOD_CACHE = "cache"

#     OBTAIN_METHOD_CHOICES = ((OBTAIN_METHOD_CACHE, _("결제")),)

#     method = models.CharField(
#         _("획득방법"),
#         max_length=20,
#         choices=OBTAIN_METHOD_CHOICES,
#     )

#     price = models.IntegerField(
#         _("가격"),
#         validators=[
#             MinValueValidator(0),
#         ],
#         default=0,
#     )

#     date_of_provision = models.IntegerField(
#         _("제공일"),
#         validators=[MinValueValidator(0)],
#         default=0,
#         help_text=_("0은 무제한 제공을 뜻함"),
#     )

#     theme = models.ForeignKey(
#         "themes.Theme",
#         related_name="obtains",
#         on_delete=models.CASCADE,
#         verbose_name=_("획득방법"),
#     )

#     class Meta:
#         verbose_name = _("테마 획득 방법")
#         verbose_name_plural = _("테마 획득 방법")

#     def __str__(self):
#         try:
#             return f"{self.theme.title}의 획득방법"
#         except models.ObjectDoesNotExist:
#             return f"{self.get_method_display()} - {self.price}"