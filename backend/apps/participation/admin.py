from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import ParticipationModel, DrawModel, ParticipationTypeModel, LevelModel, handleConsideredParticipation


@admin.action(description=_("Approuver les participations selectionnées"))
def make_approve(modeladmin, request, queryset):
    list_participation = list(queryset)[:]
    queryset.update(is_approved=True)
    messages.success(request, _("Participation(s) sélectionnée(s) Marqué(s) comme approuvé(s) avec succès !!"))
    for participation in list_participation:
        handleConsideredParticipation(participation)


@admin.action(description=_("Désapprouver les participations selectionnées"))
def make_unapprove(modeladmin, request, queryset):
    list_participation = list(queryset)[:]
    queryset.update(is_approved=False)
    messages.success(request, _("Participation(s) sélectionnée(s) Marquée(s) comme non approuvée(s) !!"))
    for participation in list_participation:
        handleConsideredParticipation(participation)


@admin.register(ParticipationModel)
class ParticipationModelAdmin(admin.ModelAdmin):
    list_display = ['user', 'contest_name', 'description', 'type_name', 'points', 'is_intensive', 'is_organizer',
                    'date', 'image_displayed', 'status']
    list_filter = ('contest__name',)
    actions = [make_approve, make_unapprove]

    def has_change_permission(self, request, obj=None):
        return obj is None

    def contest_name(self, obj):
        return obj.contest.name

    def type_name(self, obj):
        return obj.type.name if obj.type else "/"

    def image_displayed(self, obj):
        return format_html(
            f"<a target='_blank' href='{obj.image.url}'><img height='100px' width='100px' src='{obj.image.url}'></a>")

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_module_permission(self, request):
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


class UnApprovedParticipation(ParticipationModel):
    class Meta:
        proxy = True
        verbose_name = _('Participation to approve')
        verbose_name_plural = _('Participations to approve')


@admin.register(UnApprovedParticipation)
class UnApprovedParticipationAdmin(ParticipationModelAdmin):
    def get_queryset(self, request):
        return self.model.objects.filter(status=self.model.IN_VERIFICATION)

    def has_module_permission(self, request):
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


@admin.register(DrawModel)
class DrawModelAdmin(admin.ModelAdmin):
    list_display = ['contest_name', 'winner_name', 'level_name', 'date_created', 'last_modified']

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
    list_display = ['name', 'description', 'can_be_intensive', 'can_add_more_by_day', 'can_have_organizer', 'points',
                    'date_created']

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False


@admin.register(LevelModel)
class LevelModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'participation_day', 'order', 'is_active', 'date_created']
    fields = ['name', 'price', 'participation_day', 'order', 'is_active']

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False
