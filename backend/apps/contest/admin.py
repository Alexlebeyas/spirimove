import random

from apps.participation.models import DrawModel, LevelModel
from apps.participation.views import get_list_stats
from apps.users.models import User
from apps.users.views import list_all_office
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.urls import path, reverse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import ContestsModel


@admin.register(ContestsModel)
class ActivitiesModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_en', 'name_fr', 'start_date', 'end_date', 'is_open', 'date_created', 'last_modified',
                    'draw_action']
    exclude = ['date_created', 'last_modified', ]

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False

    def draw_action(self, obj):
        return format_html(
            f"<a type='button' href='{reverse('admin:run_draw', args=[obj.id])}' > {_('Run Drawn')} </a>")

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

        winner_list = self.run_global_draw_function(contest, list_res)
        self.run_office_draw_function(contest, list_res, winner_list)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

    def run_global_draw_function(self, contest, list_element_for_draw):
        """
         :contest: constest object
         :list_element_for_draw: Sorted by day

         This function carries out a random draw for participants who meet the number of days of participation for
         each level, excluding those already drawn.
         Random draw is done with th:e probability of being selected. this probability corresponds to the percentage
         of the participant's number of points over the number of points of those who are eligible for each level.
        """

        winner_list = []
        for level in LevelModel.objects.filter(is_active=True, is_for_office=False):
            list_potential_winner_except_prev_winner = list(
                filter(lambda x: x['nb_days'] >= level.participation_day and x not in winner_list,
                       list_element_for_draw))
            total_points = sum(item['nb_point'] for item in list_potential_winner_except_prev_winner)

            weights_list = [round((element['nb_point'] / total_points * 100), 2) for element in
                            list_potential_winner_except_prev_winner]

            # Random draw with probability of being selected
            winner = random.choices(list_potential_winner_except_prev_winner, weights=weights_list, k=1)[
                0] if list_potential_winner_except_prev_winner else None

            if winner:
                winner_list.append(winner)
                draw_element, updated = DrawModel.objects.update_or_create(
                    contest=contest,
                    level=level
                )
                draw_element.winner = User.objects.get(pk=winner['user_id'])
                draw_element.total_days = winner['nb_days']
                draw_element.save()
        return winner_list

    def run_office_draw_function(self, contest, list_element_for_draw, winner_list=[]):
        """
         :contest: constest object
         :list_element_for_draw: Participant statistics list sorted by day
         :winner_list Previews winner list if exist
         This function carries out a random draw for participants who meet the number of days of participation for
         office draw level (it's a level with is_for_office field set to True).
        """

        for level in LevelModel.objects.filter(is_active=True, is_for_office=True):
            for office in list_all_office():
                list_potential_winner_except_prev_winner = list(
                    filter(lambda x: x['nb_days'] >= level.participation_day and x[
                        'office_name'] == office and x not in winner_list, list_element_for_draw))

                winner = random.choice(
                    list_potential_winner_except_prev_winner) if list_potential_winner_except_prev_winner else None
                if winner:
                    winner_list.append(winner)
                    draw_element, updated = DrawModel.objects.update_or_create(
                        contest=contest,
                        level=level,
                        office=office
                    )
                    draw_element.winner = User.objects.get(pk=winner['user_id'])
                    draw_element.total_days = winner['nb_days']
                    draw_element.save()
