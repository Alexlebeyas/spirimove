import random

from apps.participation.models import ParticipationModel, DrawModel, LevelModel
from apps.users.models import User
from django.contrib import admin
from django.db.models import Count
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.urls import path, reverse
from django.utils.html import format_html

from .models import ContestsModel


@admin.register(ContestsModel)
class ActivitiesModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date', 'is_open', 'date_created', 'last_modified', 'draw_action']
    fields = ['name', 'start_date', 'end_date', 'is_open']

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False

    def draw_action(self, obj):
        return format_html(f"<a type='button' href='{reverse('admin:run_draw', args=[obj.id])}' > Run Drawn </a>")

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('draw/<int:contest_id>/', self.run_draw_function, name="run_draw"),
        ]
        return my_urls + urls

    def run_draw_function(self, request, contest_id):
        contest = get_object_or_404(ContestsModel, pk=contest_id)
        list_eleent_for_draw = get_list_element_for_draw(contest)

        winner_list = []
        for level in LevelModel.objects.filter(is_active=True):
            list_potential_winner = list_eleent_for_draw.filter(total_days__gte=level.participation_day)
            winner = make_draw_between_list(list(list_potential_winner), winner_list)
            if winner:
                winner_list.append(winner)
                draw_element, updated = DrawModel.objects.update_or_create(
                    contest=contest,
                    level=level
                )
                draw_element.winner = User.objects.get(pk=winner['user__pk'])
                draw_element.save()

        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


def get_list_element_for_draw(contest):
    list_participation = ParticipationModel.objects.filter(
        contest=contest,
        status=ParticipationModel.APPROVED,
        is_to_considered_for_day=True,
    ).values('user__pk', 'user__office', 'date').distinct()

    list_with_total_days = list_participation.values('user__pk', 'user__office'). \
        order_by('user__pk', 'user__office').annotate(total_days=Count('user__pk'))

    return list_with_total_days


def make_draw_between_list(list_element, list_to_exclude=[]):
    final_list = [element for element in list_element if element not in list_to_exclude]
    if size := len(final_list):
        return final_list[random.randrange(size)]
    return None
