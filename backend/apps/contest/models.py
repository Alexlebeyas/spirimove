from django.db import models
from django.utils.translation import gettext_lazy as _


class ContestsModel(models.Model):
    class Meta:
        verbose_name = _('Contest')
        verbose_name_plural = _('Contests')
        ordering = ['-pk']

    name = models.CharField(max_length=200, null=False, blank=False)
    nb_element_leaderboard = models.PositiveSmallIntegerField(null=True, blank=True)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=False, blank=False)
    is_open = models.BooleanField(default=True)
    date_created = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)

    def __str___(self):
        return self.name
