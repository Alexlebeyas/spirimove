from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ContestConfig(AppConfig):
    name = 'apps.contest'
    verbose_name = _('Contest')
