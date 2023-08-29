from datetime import datetime, timedelta

from apps.contest.models import ContestsModel
from django.db.models import Sum, Count, Q
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .models import ParticipationTypeModel, ParticipationModel, ReactionModel, LevelModel, DrawModel
from .serializers import AddParticipationModelSerializer, ParticipationTypeModelSerializer, ReactionsModelSerializer, \
    ListParticipationModelSerializer, LevelModelSerializer, LeaderBoardSerializer, DrawModelSerializer


# Create your views here.
class ListParticipationTypeAPIView(ListAPIView):
    """List all participation types that are active for that day"""
    queryset = ParticipationTypeModel.objects.all()
    serializer_class = ParticipationTypeModelSerializer


class DrawResultAPIView(ListAPIView):
    """ Best Results"""

    def list(self, request, *args, **kwargs):
        contest = get_object_or_404(ContestsModel, pk=kwargs['contest_id'])
        queryset = DrawModel.objects.filter(contest=contest)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    serializer_class = DrawModelSerializer


class ListAllParticipationAPIView(ListAPIView):
    """List all database participations for active contests"""
    queryset = ParticipationModel.objects.filter(contest__is_open=True)
    serializer_class = ListParticipationModelSerializer


class ListMyParticipationAPIView(ListAPIView):
    """List all participations from the current user and active contests"""

    def list(self, request, *args, **kwargs):
        queryset = ParticipationModel.objects.filter(
            user=request.user,
            contest__is_open=True
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    serializer_class = ListParticipationModelSerializer


class CreateParticipationAPIView(CreateAPIView):
    """ Create a new participation for the current user """

    def list(self, request, *args, **kwargs):
        queryset = ParticipationModel.objects.filter(
            user=request.user,
            contest__is_open=True
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    parser_classes = (FormParser, MultiPartParser,)
    serializer_class = AddParticipationModelSerializer


class ToggleReactionAPIView(CreateAPIView):
    """ Toggle current user reaction for participation """

    def handle_reaction(self, request, serializer):
        current_reaction = ReactionModel.objects.filter(user=request.user,
                                                        participation=serializer.data.get('participation'))
        if current_reaction:
            if current_reaction.first().reaction == serializer.data.get('reaction'):
                current_reaction.delete()
            else:
                current_reaction.update(reaction=serializer.data.get('reaction'))
        else:
            ReactionModel.objects.create(
                user=request.user,
                participation=get_object_or_404(ParticipationModel, pk=serializer.data.get('participation')),
                reaction=serializer.data.get('reaction')
            )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.handle_reaction(request, serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    serializer_class = ReactionsModelSerializer


class UpdateParticipationAPIView(UpdateAPIView):
    """
        Update the participation whose id has been passed through the request
        The participation must be for the current user
    """

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = get_object_or_404(ParticipationModel, pk=kwargs['pk'], user=request.user)
        serializer = self.get_serializer(instance=instance, data=request.data, partial=partial, context={'user': request.user},
                                         update_action=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    parser_classes = (FormParser, MultiPartParser,)
    queryset = ParticipationModel.objects.filter(contest__is_open=True)
    serializer_class = AddParticipationModelSerializer


class DeleteParticipationAPIView(DestroyAPIView):
    """
        Delete the participation whose id has been passed through the request
        The participation must be for the current user
    """

    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(ParticipationModel, pk=kwargs['pk'], user=request.user)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    queryset = ParticipationModel.objects.filter(contest__is_open=True)
    serializer_class = AddParticipationModelSerializer


class ListleaderBoardAPIView(ListAPIView):
    """ Leaderboard list """

    def list(self, request, *args, **kwargs):
        contest = get_object_or_404(ContestsModel, pk=kwargs['contest_id'])
        list_leaderboard = ParticipationModel.objects.filter(
            contest=contest,
            contest__is_open=True,
            is_approved=True,
            is_to_considered_for_day=True,
        ).values('user__display_name', 'user__profile_picture', 'user__office', 'contest__name'). \
            order_by('user__display_name', 'contest__name'). \
            annotate(total_points=Sum('points'), total_days=Count('user__display_name'))

        queryset = list_leaderboard.order_by('-total_points')[:contest.nb_element_leaderboard] \
            if contest.nb_element_leaderboard else list_leaderboard.order_by('-total_points')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    serializer_class = LeaderBoardSerializer


class ListMyOfficeleaderBoardAPIView(ListAPIView):
    """ Leaderboard for my office """

    def list(self, request, *args, **kwargs):
        contest = get_object_or_404(ContestsModel, pk=kwargs['contest_id'])
        liste_leaderboard = ParticipationModel.objects.filter(
            contest=contest,
            user__office=request.user.office,
            contest__is_open=True,
            is_approved=True,
            is_to_considered_for_day=True,
        ).values('user__display_name', 'user__profile_picture', 'user__office', 'contest__name', ). \
            order_by('user__display_name', 'contest__name'). \
            annotate(total_points=Sum('points'), total_days=Count('user__display_name'))

        queryset = liste_leaderboard.order_by('-total_points')[:contest.nb_element_leaderboard] \
            if contest.nb_element_leaderboard else liste_leaderboard.order_by('-total_points')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    serializer_class = LeaderBoardSerializer


@method_decorator(cache_page(60 * 30), name='dispatch')
class ListStatAPIView(ListAPIView):
    """ Globals Stats
    60 Seconds x 10 so 30 Minutes for cache
    """

    def get(self, request, *args, **kwargs):
        return Response(get_list_stats_date(get_object_or_404(ContestsModel, pk=kwargs['contest_id'])))


class ListMyStatAPIView(ListAPIView):
    """ My Stats data"""

    def get(self, request, *args, **kwargs):
        contest = get_object_or_404(ContestsModel, pk=kwargs['contest_id'])
        user_participations_data = ParticipationModel.objects. \
            filter(contest=contest, user=request.user, is_to_considered_for_day=True, is_approved=True). \
            exclude(Q(user__office=None) | Q(user__is_active=False)). \
            values_list('contest__name', 'user__display_name', 'date', 'points')

        list_date = list(user_participations_data.values_list('date', flat=True).distinct())

        users_data_with_total_points = user_participations_data.values('contest__name', 'user__display_name'). \
            order_by('user__display_name', 'contest__name').annotate(total_points=Sum('points'))

        yesterday = datetime.now() - timedelta(1)
        streak = 0
        while yesterday.date() in list_date:
            streak += 1
            yesterday = yesterday - timedelta(1)

        user_stats = []
        if users_data_with_total_points.count():
            user_stats = list(users_data_with_total_points)[0]
            user_stats.setdefault('streak', streak)

        return Response(user_stats)


class ListDateForContestAPIView(ListAPIView):
    """ List of contest dates"""

    def list(self, request, *args, **kwargs):
        return Response(get_list_contest_date(get_object_or_404(ContestsModel, pk=kwargs['contest_id'])))


class ListLevelAPIView(ListAPIView):
    """List all active level"""
    queryset = LevelModel.objects.filter(is_active=True)
    serializer_class = LevelModelSerializer


def get_list_stats_date(contest, user=None):
    list_date = get_list_contest_date(contest)
    stats_for_users = ParticipationModel.objects.filter(is_to_considered_for_day=True, is_approved=True). \
        exclude(Q(user__office=None) | Q(user__is_active=False)). \
        values_list('user__pk', 'contest__name', 'user__office', 'user__display_name', 'date', 'points'). \
        order_by('user__display_name', 'contest__name', 'date'). \
        annotate(total_points=Sum('points'))

    if user:
        stats_for_users = stats_for_users.filter(user__pk=user.pk)

    result = {}
    for element in stats_for_users:
        result.setdefault(element[3], {}).setdefault(element[4], element[6])

    for el in result:
        # Set points to 0 on all dates where the user did not participate
        result[el].update({x: 0 for x in list_date if x not in result[el]})
        # Sort by date
        result[el] = sorted(result[el].items(), key=lambda x: x[0])
    return result


def get_list_contest_date(contest):
    return [contest.start_date + timedelta(days=x) for x in
            range((contest.end_date - (contest.start_date - timedelta(1))).days)]
