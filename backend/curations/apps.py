from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class CurationsConfig(AppConfig):
    name = "curations"
    verbose_name = _("큐레이션")
