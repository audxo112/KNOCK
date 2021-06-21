from django.db import models
from django.utils.translation import gettext_lazy as _
from core import models as core_models
from . import managers


class ThemeList(core_models.FleetModels):
    theme = models.ForeignKey(
        "themes.Theme",
        related_name="lists",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )
    group = models.ForeignKey(
        "curations.ThemeCurationGroup",
        related_name="lists",
        on_delete=models.CASCADE,
        verbose_name=_("그룹"),
    )
    folder = models.ForeignKey(
        "curations.ThemeCurationFolder",
        related_name="lists",
        on_delete=models.CASCADE,
        verbose_name=_("폴더"),
        null=True,
    )

    order = models.PositiveIntegerField(
        _("순서"),
        default=1,
    )

    objects = managers.ThemeListManager()

    class Meta:
        verbose_name = _("테마 목록")
        verbose_name_plural = _("테마 목록")

    def __str__(self):
        return f"{self.theme.title}"

    def save(self, *args, **kwargs):
        if not self.id:
            try:
                top = ThemeList.objects.order_by("-order")[0]
                self.order = top.order + 1
            except IndexError:
                self.order = 1

        super(ThemeList, self).save(*args, **kwargs)
