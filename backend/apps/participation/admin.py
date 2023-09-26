import csv

from apps.contest.models import ContestsModel
from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import ParticipationModel, DrawModel, ParticipationTypeModel, LevelModel

participation_list_display = ['date', 'user__display_name', 'status', 'type__name', 'is_intensive', 'is_organizer',
                              'points', 'description', 'image_displayed']
participation_list_to_export = participation_list_display[:-1]


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

    writer.writerow(field_names)
    for obj in queryset:
        writer.writerow([obj.get(field) for field in field_names])

    messages.success(request, _("Exportation réussie !"))
    return response


@admin.register(ParticipationModel)
class ParticipationModelAdmin(admin.ModelAdmin):
    list_display = participation_list_display
    list_filter = ('contest__name',)
    actions = [make_approve, make_rejected, make_unapprove, export_participations_as_csv]

    def has_change_permission(self, request, obj=None):
        return obj is None

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

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_module_permission(self, request):
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


class PendingParticipation(ParticipationModel):
    class Meta:
        proxy = True
        verbose_name = _('Participation en attente')
        verbose_name_plural = _('Participations en attente')


@admin.register(PendingParticipation)
class PendingParticipationAdmin(ParticipationModelAdmin):
    actions = [make_approve, make_rejected, export_participations_as_csv]
    list_display = participation_list_display

    def get_queryset(self, request):
        return self.model.objects.filter(
            status=self.model.IN_VERIFICATION,
            contest=ContestsModel.current_contest.first()
        )

    def has_module_permission(self, request):
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


class ResolvedParticipation(ParticipationModel):
    class Meta:
        proxy = True
        verbose_name = _('Participation résolue')
        verbose_name_plural = _('Participations résolues')


@admin.register(ResolvedParticipation)
class ResolvedParticipationAdmin(ParticipationModelAdmin):
    actions = [make_unapprove, export_participations_as_csv]
    list_display = participation_list_display

    def get_queryset(self, request):
        return self.model.objects.filter(
            status__in=[self.model.REJECTED, self.model.APPROVED],
            contest=ContestsModel.current_contest.first()
        )

    def has_module_permission(self, request):
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


@admin.register(DrawModel)
class DrawModelAdmin(admin.ModelAdmin):
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

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return obj is None


@admin.register(ParticipationTypeModel)
class ParticipationTypeModelAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'name_fr', 'name_en', 'can_be_intensive', 'can_add_more_by_day', 'can_have_organizer',
                    'shoul_be_display_on_feed', 'should_set_image', 'points', 'date_created']
    exclude = ['description', ]

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False


@admin.register(LevelModel)
class LevelModelAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'price', 'participation_day', 'order', 'is_active', 'date_created']
    exclude = ['last_modified', ]

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False
