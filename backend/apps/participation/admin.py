import csv

from apps.contest.models import ContestsModel
from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from spiri_move.admin_panel_permissions import ModerationPermissions, AdminPermissions

from .models import ParticipationModel, DrawModel, ParticipationTypeModel, LevelModel

participation_list_to_export = ['date', 'user__display_name', 'status', 'type__name', 'is_intensive', 'is_organizer',
                                'points', 'description']
participation_list_header_to_export = ['DATE', 'USER', 'STATUS', 'TYPE', 'HIGH INTENSITY', 'INITIATOR',
                                       'PTS', 'DESCRIPTON']


@admin.action(description=_("Approuver les participations selectionnées"))
def make_approve(modeladmin, request, queryset):
    queryset.update(status=ParticipationModel.APPROVED)
    messages.success(request, _("Participation(s) sélectionnée(s) Marqué(s) comme approuvé(s) avec succès !!"))


@admin.action(description=_("Rejeter les participations selectionnées"))
def make_rejected(modeladmin, request, queryset):
    queryset.update(status=ParticipationModel.REJECTED)
    messages.success(request, _("Participation(s) sélectionnée(s) Marquée(s) comme rejetée(s) !!"))


@admin.action(description=_("Réinitialiser la décision des participations selectionnées"))
def make_unapprove(modeladmin, request, queryset):
    queryset.update(status=ParticipationModel.IN_VERIFICATION)
    messages.success(request, _("Participation(s) sélectionnée(s) Marquée(s) comme non approuvée(s) !!"))


@admin.action(description=_("Exporter les participations selectionnées en CSV"))
def export_participations_as_csv(modeladmin, request, queryset):
    field_names = participation_list_to_export
    queryset = queryset.values(*field_names)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=Participations.csv'
    writer = csv.writer(response)

    writer.writerow(participation_list_header_to_export)
    for obj in queryset:
        writer.writerow([obj.get(field) for field in field_names])

    messages.success(request, _("Exportation réussie !"))
    return response


@admin.register(ParticipationModel)
class ParticipationModelAdmin(ModerationPermissions, admin.ModelAdmin):
    list_display = ['date', 'user__display_name', 'status', 'type__name', 'is__intensive', 'is__organizer',
                    'points_field', 'description', 'image_displayed']
    list_filter = ('date', 'status')
    search_fields = ('user__display_name', 'type__name', 'description', 'status')
    actions = [make_approve, make_rejected, make_unapprove, export_participations_as_csv]

    def contest__name(self, obj):
        return obj.contest.name

    def user__display_name(self, obj):
        return obj.user.display_name

    def type__name(self, obj):
        return obj.type.name if obj.type else "/"

    def image_displayed(self, obj):
        if obj.image:
            return format_html(
                "<a target='_blank' href='{}'><img height='100px' src='{}' />",
                obj.image.url,
                obj.image.url)
        return "/"

    def is__intensive(self, obj):
        return obj.is_intensive

    def is__organizer(self, obj):
        return obj.is_organizer

    def points_field(self, obj):
        return obj.points

    user__display_name.short_description = _('User')
    type__name.short_description = _('Type')
    is__intensive.short_description = _('High Intensity')
    is__organizer.short_description = _('Initiator')
    points_field.short_description = _('Pts')
    is__organizer.boolean = True
    is__intensive.boolean = True


class PendingParticipation(ParticipationModel):
    class Meta:
        proxy = True
        verbose_name = _('Participation à revoir')
        verbose_name_plural = _('Participations à revoir')


@admin.register(PendingParticipation)
class PendingParticipationAdmin(ParticipationModelAdmin):
    actions = [make_approve, make_rejected, export_participations_as_csv]

    def get_queryset(self, request):
        return self.model.objects.filter(
            status=self.model.IN_VERIFICATION,
            contest=ContestsModel.current_contest.first()
        )


class ResolvedParticipation(ParticipationModel):
    class Meta:
        proxy = True
        verbose_name = _('Participation revue')
        verbose_name_plural = _('Participations revues')


@admin.register(ResolvedParticipation)
class ResolvedParticipationAdmin(ParticipationModelAdmin):
    actions = [make_unapprove, export_participations_as_csv]

    def get_queryset(self, request):
        return self.model.objects.filter(
            status__in=[self.model.REJECTED, self.model.APPROVED],
            contest=ContestsModel.current_contest.first()
        )


@admin.register(DrawModel)
class DrawModelAdmin(AdminPermissions, admin.ModelAdmin):
    list_display = ['contest_name',
                    'winner_name',
                    'level_name',
                    'office',
                    'total_days',
                    'date_created',
                    'last_modified']

    def contest_name(self, obj):
        return obj.contest.name

    def winner_name(self, obj):
        return f"{obj.winner.display_name} ({obj.winner.email})"

    def level_name(self, obj):
        return f"{obj.level.name}"

    def has_change_permission(self, request, obj=None):
        """
            Edit permissions for moderator and admin
        """
        return False


@admin.register(ParticipationTypeModel)
class ParticipationTypeModelAdmin(AdminPermissions, admin.ModelAdmin):
    list_display = ['pk', 'name', 'name_fr', 'name_en', 'can_be_intensive', 'can_add_more_by_day', 'can_have_organizer',
                    'shoul_be_display_on_feed', 'should_set_image', 'points', 'date_created']
    exclude = ['description', ]


@admin.register(LevelModel)
class LevelModelAdmin(AdminPermissions, admin.ModelAdmin):
    list_display = ['pk', 'name', 'price', 'participation_day', 'order', 'is_active', 'date_created']
    exclude = ['last_modified', ]
