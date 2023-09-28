from collections import namedtuple
from datetime import timedelta

from apps.contest.models import ContestsModel
from apps.users.models import User, Role
from django.db import connection
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from spiri_move.custom_permissions import ParticipantPermission
from spiri_move.pagination_settings import FeedPagination

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

    def get_queryset(self):
        return ParticipationModel.objects.filter(
            contest=ContestsModel.current_contest.first(),
            type__shoul_be_display_on_feed=True
        )

    serializer_class = ListParticipationModelSerializer
    pagination_class = FeedPagination


class ListMyParticipationAPIView(ListAPIView):
    """List all participations from the current user and active contests"""

    def list(self, request, *args, **kwargs):
        queryset = ParticipationModel.objects.filter(
            user=request.user,
            contest=ContestsModel.current_contest.first()
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    serializer_class = ListParticipationModelSerializer


class CreateParticipationAPIView(CreateAPIView):
    """ Create a new participation for the current user """
    permission_classes = [ParticipantPermission]

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

    permission_classes = [ParticipantPermission]

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

    permission_classes = [ParticipantPermission]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = get_object_or_404(ParticipationModel, pk=kwargs['pk'], user=request.user)
        serializer = self.get_serializer(instance=instance, data=request.data, partial=partial,
                                         context={'user': request.user})
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

    permission_classes = [ParticipantPermission]

    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(ParticipationModel, pk=kwargs['pk'], user=request.user)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    queryset = ParticipationModel.objects.filter(contest__is_open=True)
    serializer_class = AddParticipationModelSerializer


class ListleaderBoardAPIView(ListAPIView):
    """Leaderboard list"""

    def list(self, request, *args, **kwargs):
        contest = get_object_or_404(ContestsModel, pk=kwargs["contest_id"])
        queryset = get_leaderboard_stats(contest)
        serializer = self.get_serializer(queryset, many=True, context=request)
        return Response(serializer.data)

    serializer_class = LeaderBoardSerializer


class ListStatAPIView(ListAPIView):
    """ Globals Stats
    60 Seconds x 10 so 30 Minutes for cache
    """

    def get(self, request, *args, **kwargs):
        return Response(get_list_stats(get_object_or_404(ContestsModel, pk=kwargs['contest_id'])))


class ListMyStatAPIView(ListAPIView):
    """ My Stats data"""

    def get(self, request, *args, **kwargs):
        return Response(get_list_stats(get_object_or_404(ContestsModel, pk=kwargs['contest_id']), request.user)[0])


class ListDateForContestAPIView(ListAPIView):
    """ List of contest dates"""

    def list(self, request, *args, **kwargs):
        return Response(get_list_contest_date(get_object_or_404(ContestsModel, pk=kwargs['contest_id'])))


class ListLevelAPIView(ListAPIView):
    """List all active level"""
    queryset = LevelModel.objects.filter(is_active=True)
    serializer_class = LevelModelSerializer


Stat = namedtuple(
    "Stat",
    [
        "user__email",
        "user__display_name",
        "user__profile_picture",
        "user__office",
        "total_points",
        "total_days",
        "max_consecutive_days",
    ],
)


def get_leaderboard_stats(contest):
    """
    Compute statistics for the leaderboard.
    Most notably the maximum consecutive days a user submitted a participation.
    The logic for the query looks something like:
    - start from all approved participations for a contest
    - only count one participation per (user / day / type), keeping the one with most points
    - sum the points per user for each day
    - identify the streaks per user (consecutive days with a participation) and count their length
    - keep only longest streak for each user and sort results by streak length DESC,
    - aggregate all the statistics per user (total_days, total_points, max_consecutive_days)
    """
    with connection.cursor() as cursor:
        cursor.execute(
            """
WITH starter AS (
    SELECT
        date,
        contest_id,
        status,
        user_id,
        points,
        type_id
    FROM participation_participationmodel
    WHERE
        contest_id = %s
        AND status = 'APPROVED'
)
,pbt as (
    SELECT date,
        user_id,
        type_id,
        MAX(points) as points_by_type
    FROM starter
    GROUP BY date, user_id, type_id
)
,pbd as (
    SELECT date,
        user_id,
        SUM(points_by_type) as points_by_day
    FROM pbt
    GROUP BY date, user_id
)
,lagged as (
    SELECT *,
        LAG(date, 1) OVER (partition by user_id order by date) as previous_date
    FROM pbd
)
,streak_change as (
    SELECT *,
        CASE WHEN (date - previous_date) = 1 THEN 0 ELSE 1 END as streak_changed
    FROM lagged
)
,streak_identified as (
    SELECT *,
        SUM(streak_changed) OVER (partition by user_id order by date) AS streak_id
    FROM streak_change
)
,streak_counts as (
    SELECT *,
        ROW_NUMBER() OVER (partition by user_id, streak_id order by date) as streak_length
    FROM streak_identified
)
,ranked as (
    SELECT *,
        ROW_NUMBER() over (partition by user_id ORDER BY streak_length DESC) as by_user_rank,
        RANK() OVER (partition by user_id, streak_id ORDER BY streak_length DESC) AS rank,
        SUM(points_by_day) over (partition by user_id) as total_points,
        COUNT(date) over (partition by user_id) as total_days
    FROM streak_counts
)

SELECT
    uu.email as user__email,
    uu.display_name as user__display_name,
    uu.profile_picture as user__profile_picture,
    uu.office as user__office,
    r.total_points,
    r.total_days,
    r.streak_length as max_consecutive_days
FROM ranked r
    INNER JOIN users_user uu ON r.user_id = uu.id
WHERE rank = 1 AND by_user_rank = 1
        """,
            [contest.id],
        )
        return [Stat(*row) for row in cursor.fetchall()]


def get_list_stats(current_contest, user=None):
    result_final = []

    list_users = User.objects.all() if not user else User.objects.filter(pk=user.pk)
    for participant in list_users.filter(groups__name=Role.PARTICIPANT).order_by('display_name'):
        data_user = list(ParticipationModel.objects
                         .filter(contest=current_contest, user=participant, status=ParticipationModel.APPROVED)
                         .extra(select={'day': 'date( date )'}).values('day')
                         .order_by('day').annotate(total_points=Sum('points')))

        result = {str(data['day']): data['total_points'] for data in data_user}
        result_final.append({
            'user_id': participant.pk,
            'display_name': participant.display_name,
            'contest_name': current_contest.name,
            'office_name': participant.office,
            'stats': result,
            'nb_days': len(result.keys()),
            'nb_point': sum(result.values()),
        })
    return result_final


def get_list_contest_date(contest):
    return [contest.start_date + timedelta(days=x) for x in
            range((contest.end_date - (contest.start_date - timedelta(1))).days)]
