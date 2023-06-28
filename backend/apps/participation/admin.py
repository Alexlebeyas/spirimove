from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from django.contrib import messages
from .models import *


@admin.register(ParticipationModel)
class ParticipationModelAdmin(admin.ModelAdmin):
    list_display = ['user', 'contest_name',  'description', 'type_name', 'points', 'is_intensive', 'date', 'image_displayed', 'is_approved', 'is_to_considered_for_day',]
    list_filter = ('contest__name',)

    def has_change_permission(self, request, obj=None):
        return obj is None

    def contest_name(self, obj):
        return obj.contest.name

    def type_name(self, obj):
        return obj.type.name if obj.type else "/"

    def image_displayed(self, obj):
        return format_html(f"<a target='_blank' href='{obj.image.url}'><img height='100px' width='100px' src='{obj.image.url}'></a>")

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_module_permission(self, request):
        return request.user.is_admin()


class UnApprovedParticipation(ParticipationModel):
    class Meta:
        proxy = True
        verbose_name = _('Participation to approve')
        verbose_name_plural = _('Participations to approve')


@admin.register(UnApprovedParticipation)
class UnApprovedParticipationAdmin(ParticipationModelAdmin):
    def get_queryset(self, request):
        return self.model.objects.filter(is_approved=False)

    def make_active(modeladmin, request, queryset):
        list_participation = list(queryset)[:]
        queryset.update(is_approved=True)
        messages.success(request, _("Selected Participation(s) Marked as approved Successfully !!"))
        for participation in list_participation:
            handleConsideredParticipation(participation)

    def make_inactive(modeladmin, request, queryset):
        list_participation = list(queryset)[:]
        queryset.update(is_approved=False)
        messages.success(request, _("Selected Participation(s) Marked as not approved Successfully !!"))
        for participation in list_participation:
            handleConsideredParticipation(participation)

    def has_module_permission(self, request):
        return (request.user.is_moderator() or request.user.is_admin())

    admin.site.add_action(make_active, _("Approve"))
    admin.site.add_action(make_inactive, _("Disapprove"))


@admin.register(ParticipationTypeModel)
class ParticipationTypeModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'date_created']

    def has_module_permission(self, request):
        return request.user.is_admin()

