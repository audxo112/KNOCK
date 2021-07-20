from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from core import models as core_models
from . import managers


class ThemeCurationGroup(core_models.FleetRandomIDModels):
    VIEW_TYPE_L_HORIZONTAL_SCROLL = "L_HorizontalScroll"
    VIEW_TYPE_M_HORIZONTAL_SCROLL = "M_HorizontalScroll"
    VIEW_TYPE_S_HORIZONTAL_SCROLL = "S_HorizontalScroll"
    VIEW_TYPE_LIST = "List"
    VIEW_TYPE_SQUARE_ALBUM = "SquareAlbum"

    VIEW_TYPE_CHOICES = (
        (VIEW_TYPE_L_HORIZONTAL_SCROLL, "횡 스크롤 뷰 L"),
        (VIEW_TYPE_M_HORIZONTAL_SCROLL, "횡 스크롤 뷰 M"),
        (VIEW_TYPE_S_HORIZONTAL_SCROLL, "횡 스크롤 뷰 S"),
        (VIEW_TYPE_LIST, "리스트 뷰"),
        (VIEW_TYPE_SQUARE_ALBUM, "앨범뷰 (Square)"),
    )

    title = models.CharField(
        _("제목"),
        max_length=12,
        default="",
    )

    view_type = models.CharField(
        _("뷰 유형"),
        choices=VIEW_TYPE_CHOICES,
        max_length=30,
        default=VIEW_TYPE_L_HORIZONTAL_SCROLL,
    )

    post_start_datetime = models.DateTimeField(
        _("게시 시작일"),
        default=timezone.now,
    )

    post_end_datetime = models.DateTimeField(
        _("게시 종료일"), default=core_models.default_end_date
    )

    order = models.PositiveIntegerField(
        _("순서"),
        default=1,
    )

    objects = managers.GroupManager()

    class Meta:
        verbose_name = _("테마 큐레이션 그룹")
        verbose_name_plural = _("테마 큐레이션 그룹")
        ordering = ["-order"]

    def __str__(self):
        return f"{self.title}"

    def save(self, *args, **kwargs):
        if not self.id:
            try:
                top = ThemeCurationGroup.objects.order_by("-order")[0]
                self.order = top.order + 1
            except IndexError:
                self.order = 1
        super(ThemeCurationGroup, self).save(*args, **kwargs)


class ThemeCurationFolder(core_models.FleetRandomIDModels):
    title = models.CharField(
        _("제목"),
        max_length=12,
        blank=True,
        default="",
    )

    sub_title = models.CharField(
        _("소제목"),
        max_length=16,
        blank=True,
        default="",
    )

    description = models.CharField(
        _("설명"),
        max_length=16,
        blank=True,
        default="",
    )

    dominant_color = models.CharField(_("대표색"), max_length=7, default="#000000")

    order = models.PositiveIntegerField(
        _("순서"),
        default=1,
    )

    group = models.ForeignKey(
        "curations.ThemeCurationGroup",
        related_name="folders",
        on_delete=models.CASCADE,
        verbose_name=_("그룹"),
    )

    objects = managers.FolderManager()

    class Meta:
        verbose_name = _("테마 큐레이션 폴더")
        verbose_name_plural = _("테마 큐레이션 폴더")
        ordering = ["-order"]

    def __str__(self):
        return f"{self.title}"

    def save(self, *args, **kwargs):
        if not self.id:
            try:
                top = ThemeCurationFolder.objects.order_by("-order")[0]
                self.order = top.order + 1
            except IndexError:
                self.order = 1
        super(ThemeCurationFolder, self).save(*args, **kwargs)


class ThemeCurationFolderCover(core_models.FleetThumbnailModels):
    folder = models.ForeignKey(
        "curations.ThemeCurationFolder",
        related_name="covers",
        on_delete=models.CASCADE,
        verbose_name=_("폴더"),
    )

    objects = managers.CoverManager()

    class Meta:
        verbose_name = _("폴더 커버")
        verbose_name_plural = _("폴더 커버")

    def __str__(self):
        return f"{self.id}"

    def get_dir(self):
        return f"{self.folder.get_dir()}/cover/{self.image_size_type}"
