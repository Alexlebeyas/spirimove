import uuid
from datetime import date

from apps.contest.models import ContestsModel
from apps.users.models import User
from django.db import models
from django.db.models.aggregates import Max
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from slugify import slugify
from spiri_move.azure_storage import get_storage


def participation_picture_path(instance, filename):
    todays_date = date.today()
    ext = filename.split('.')[-1]
    if instance.user.display_name:
        return f"participations/{todays_date.year}/{todays_date.month}/{todays_date.day}/" \
               f"{slugify(instance.user.display_name)}_{uuid.uuid1()}.{ext}"
    else:
        return f"participations/{todays_date.year}/{todays_date.month}/{todays_date.day}/{uuid.uuid1()}.{ext}"


class ParticipationTypeModel(models.Model):
    class Meta:
        verbose_name = _('Participation type')
        verbose_name_plural = _('Participations type')
        ordering = ['pk']

    name = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    points = models.PositiveSmallIntegerField(null=False, blank=False, default=1)
    from_date = models.DateField(null=True, blank=True)
    to_date = models.DateField(null=True, blank=True)
    can_be_intensive = models.BooleanField(default=False)
    can_add_more_by_day = models.BooleanField(default=False)
    can_have_organizer = models.BooleanField(default=False)
    date_created = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)

    def __str___(self):
        return self.name


class ParticipationModel(models.Model):
    class Meta:
        verbose_name = _('Participation')
        verbose_name_plural = _('Participations')
        ordering = ['-pk']

    IN_VERIFICATION = 'IN_VERIFICATION'
    REJECTED = 'REJECTED'
    APPROVED = 'APPROVED'
    STATUS_CHOICES = [
        (IN_VERIFICATION, _('In verification')),
        (REJECTED, _('Rejected')),
        (APPROVED, _('Approved'))
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # This field could be use to check if it's extra activity
    type = models.ForeignKey(ParticipationTypeModel, on_delete=models.CASCADE, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    points = models.PositiveSmallIntegerField(null=False, blank=False, default=1)
    date = models.DateField(null=False, blank=False)
    image = models.ImageField(upload_to=participation_picture_path, storage=get_storage(private=True), null=False,
                              blank=False)
    contest = models.ForeignKey(ContestsModel, on_delete=models.CASCADE)
    is_to_considered_for_day = models.BooleanField(default=False)
    is_intensive = models.BooleanField(default=False)
    is_organizer = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    status = models.CharField(_('Status'), choices=STATUS_CHOICES, default=IN_VERIFICATION, max_length=50)
    date_created = models.DateTimeField(editable=False)
    last_modified = models.DateTimeField()

    def __str___(self):
        return self.pk

    def save(self, *args, **kwargs):
        if not self.pk:
            self.date_created = timezone.now()
        self.last_modified = timezone.now()

        self.is_intensive = self.type.can_be_intensive and self.is_intensive
        self.is_organizer = self.type.can_have_organizer and self.is_organizer
        self.points = self.type.points
        if self.is_intensive:
            self.points += 1
        if self.is_organizer:
            self.points += 1
        super().save(*args, **kwargs)


class ReactionModel(models.Model):
    class Meta:
        verbose_name = _('Reaction')
        verbose_name_plural = _('Reactions')
        unique_together = ["user", "participation"]
        ordering = ['-pk']

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    participation = models.ForeignKey(ParticipationModel, on_delete=models.CASCADE)
    reaction = models.CharField(_('Reactions'), max_length=150)

    def save(self, *args, **kwargs):
        self.reaction = self.reaction.lower()
        super().save(*args, **kwargs)


class LevelModel(models.Model):
    class Meta:
        verbose_name = _('Level')
        verbose_name_plural = _('Levels')
        ordering = ['order']

    name = models.CharField(max_length=200, null=False, blank=False)
    price = models.CharField(max_length=200, null=False, blank=False, default=1)
    participation_day = models.PositiveSmallIntegerField(null=False, blank=False, default=1)
    order = models.PositiveSmallIntegerField(null=False, blank=False, default=1)
    is_active = models.BooleanField(default=True)
    date_created = models.DateTimeField(editable=False, null=True, blank=True)
    last_modified = models.DateTimeField(null=True, blank=True)


class DrawModel(models.Model):
    class Meta:
        verbose_name = _('Draw')
        verbose_name_plural = _('Draw')

    contest = models.ForeignKey(ContestsModel, on_delete=models.CASCADE, null=True, blank=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    level = models.ForeignKey(LevelModel, on_delete=models.CASCADE, null=True, blank=True)
    date_created = models.DateTimeField(editable=False, null=True, blank=True)
    last_modified = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.date_created = timezone.now()
        self.last_modified = timezone.now()
        super().save(*args, **kwargs)


def handleConsideredParticipation(participation):
    """
    In this section we choose the participation to be considered
    for the calculation of the points among several of the same
    type entered on the same day by the same user and which has been
     approved. The one with the highest number of points is the one to consider
    :param participation:
    :return None:
    """
    participations_day_for_type = ParticipationModel.objects.filter(
        user=participation.user,
        date=participation.date,
        type=participation.type,
        contest=participation.contest,
    )
    participations_day_for_type.update(is_to_considered_for_day=False, status=ParticipationModel.REJECTED)
    list_anotate = participations_day_for_type. \
        values('user', 'type', 'date', 'contest', 'is_approved').annotate(max_points=Max('points'))
    if list_anotate:
        main_participation = ParticipationModel.objects.filter(
            user=participation.user,
            date=participation.date,
            type=participation.type,
            contest=participation.contest,
            is_approved=True,
            points=list_anotate[0]['max_points']
        ).first()
        if main_participation:
            main_participation.is_to_considered_for_day = True
            main_participation.status = ParticipationModel.APPROVED
            main_participation.save()
