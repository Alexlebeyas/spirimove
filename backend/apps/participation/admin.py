from apps.contest.models import ContestsModel
from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import ParticipationModel, DrawModel, ParticipationTypeModel, LevelModel


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


@admin.register(ParticipationModel)
class ParticipationModelAdmin(admin.ModelAdmin):
    list_display = ['user_name', 'contest_name', 'description', 'type_name', 'points', 'is_intensive', 'is_organizer',
                    'date', 'image_displayed', 'status']
    list_filter = ('contest__name',)
    actions = [make_approve, make_rejected, make_unapprove, ]

    def has_change_permission(self, request, obj=None):
        return obj is None

    def contest_name(self, obj):
        return obj.contest.name

    def user_name(self, obj):
        return obj.user.display_name

    def type_name(self, obj):
        return obj.type.name if obj.type else "/"

    def image_displayed(self, obj):
        if obj.image:
            return format_html(
                f"<a target='_blank' href='{obj.image.url}'><img height='100px' width='100px' src='{obj.image.url}'></a>")
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
        verbose_name = _('Pending participation')
        verbose_name_plural = _('Pending participations')


@admin.register(PendingParticipation)
class PendingParticipationAdmin(ParticipationModelAdmin):
    actions = [make_approve, make_rejected]
    list_display = ['date', 'user_name', 'status', 'type_name', 'is_intensive', 'is_organizer', 'points', 'description',
                    'image_displayed']

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
        verbose_name = _('Resolved participation')
        verbose_name_plural = _('Resolved participations')


@admin.register(ResolvedParticipation)
class ResolvedParticipationAdmin(ParticipationModelAdmin):
    actions = [make_unapprove]
    list_display = ['date', 'user_name', 'status', 'type_name', 'is_intensive', 'is_organizer', 'points', 'description',
                    'image_displayed']

    def get_queryset(self, request):
        return self.model.objects.filter(
            status__in=[self.model.REJECTED, self.model.APPROVED],
            contest=ContestsModel.current_contest.first()
        )

    def has_module_permission(self, request):
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


@admin.register(DrawModel)
class DrawModelAdmin(admin.ModelAdmin):
    list_display = ['contest_name', 'winner_name', 'level_name', 'office', 'total_days', 'date_created',
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
