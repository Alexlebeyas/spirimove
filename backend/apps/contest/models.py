from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import UniqueConstraint, Q
from django.utils.translation import gettext_lazy as _


class CurrentContestManager(models.Manager):
    def get_queryset(self):
        open_contest = super().get_queryset().filter(is_open=True)
        return open_contest if open_contest.exists() else super().get_queryset().all()


class ContestsModel(models.Model):
    class Meta:
        verbose_name = _('Contest')
        verbose_name_plural = _('Contests')
        ordering = ['-pk']
        constraints = [
            UniqueConstraint(fields=('is_open',), condition=Q(is_open=True),
                             name="unique_is_open_true"),
        ]

    name = models.CharField(max_length=200, null=False, blank=False, verbose_name=_("Contest name"))
    start_date = models.DateField(null=False, blank=False, verbose_name=_("Start date"))
    end_date = models.DateField(null=False, blank=False, verbose_name=_("End date"))
    show_winners = models.BooleanField(default=False, verbose_name=_("Show winners"))
    is_open = models.BooleanField(default=True, verbose_name=_("Open ?"))
    date_created = models.DateField(auto_now_add=True, verbose_name=_("Date created"))
    last_modified = models.DateField(auto_now=True, verbose_name=_("Last modified"))

    objects = models.Manager()  # The default manager.
    current_contest = CurrentContestManager()  # The current Contest Manager.

    def __str___(self):
        return self.name

    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError({
                'end_date': ValidationError(
                    _("The contest end date must be later than the start date")),
            })
