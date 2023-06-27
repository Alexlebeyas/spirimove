from apps.contest.models import ContestsModel
from apps.users.models import User
from django.db import models
from django.utils.translation import gettext_lazy as _


class ParticipationTypeModel(models.Model):
    class Meta:
        verbose_name = _('Participation type')
        verbose_name_plural = _('Participations type')

    name = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    points = models.PositiveSmallIntegerField(null=False, blank=False, default=1)
    from_date = models.DateField(null=True, blank=True)
    to_date = models.DateField(null=True, blank=True)
    date_created = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)

    def __str___(self):
        return self.name


class ParticipationModel(models.Model):
    class Meta:
        verbose_name = _('Participation')
        verbose_name_plural = _('Participations')
        ordering = ['-pk']

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # This field could be use to check if it's extra activity
    type = models.ForeignKey(ParticipationTypeModel, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    points = models.PositiveSmallIntegerField(null=False, blank=False, default=1)
    date = models.DateField(null=False, blank=False)
    image = models.ImageField(upload_to='uploads/%Y/%m/%d/', null=False, blank=False)
    contest = models.ForeignKey(ContestsModel, on_delete=models.CASCADE)
    is_intensive = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    date_created = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)

    def __str___(self):
        return self.name

    def save(self, *args, **kwargs):
        self.points = 1
        if self.type:
            self.points = self.type.points
        elif self.is_intensive:
            self.points += 1
        super().save(*args, **kwargs)
