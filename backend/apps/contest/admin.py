import random

from apps.participation.models import DrawModel, LevelModel
from apps.participation.views import get_list_stats
from apps.users.models import User
from django.contrib import admin
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
        list_element_for_draw = get_list_stats(contest)

        list_res = sorted(list_element_for_draw, key=lambda data: data['nb_days'], reverse=True)

        winner_list = []
        for level in LevelModel.objects.filter(is_active=True):
            list_potential_winner_except_prev_winner = filter(lambda x: x['nb_days'] >= level.participation_day and x not in winner_list, list_res)
            winner = random.choice(list(list_potential_winner_except_prev_winner))

            if winner:
                winner_list.append(winner)
                draw_element, updated = DrawModel.objects.update_or_create(
                    contest=contest,
                    level=level
                )
                draw_element.winner = User.objects.get(pk=winner['user_id'])
                draw_element.total_days = winner['nb_days']
                draw_element.save()
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
