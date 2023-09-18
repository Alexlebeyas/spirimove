from django.db import models
from django.db.models import UniqueConstraint, Q
from django.utils.translation import gettext_lazy as _


class CurrentContestManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_open=True)


class ContestsModel(models.Model):
    class Meta:
        verbose_name = _('Contest')
        verbose_name_plural = _('Contests')
        ordering = ['-pk']
        constraints = [
            UniqueConstraint(fields=('is_open',), condition=Q(is_open=True),
                             name=_('Only one contest can be set to open at a time')),
        ]

    name = models.CharField(max_length=200, null=False, blank=False)
    nb_element_leaderboard = models.PositiveSmallIntegerField(null=True, blank=True)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=False, blank=False)
    show_winners = models.BooleanField(default=False)
    is_open = models.BooleanField(default=True)
    date_created = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)

    objects = models.Manager()  # The default manager.
    current_contest = CurrentContestManager()  # The current Contest Manager.

    def __str___(self):
        return self.name
