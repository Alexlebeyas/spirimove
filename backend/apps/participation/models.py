from django.db import models
from apps.contest.models import ContestsModel
from django.utils.translation import gettext_lazy as _


class ParticipationModel(models.Model):
    class Meta:
        verbose_name = _('Participation')
        verbose_name_plural = _('Participations')

    name = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    intensity = models.IntegerField(null=True, blank=True)
    date = models.DateField(null=False, blank=False)
    image = models.FileField(upload_to='uploads/%Y/%m/%d/', null=False)
    participationcontest = models.ForeignKey(ContestsModel, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)

    def __str___(self):
        return self.name

