from apps.contest.models import ContestsModel
from datetime import datetime, timedelta
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from .serializers import *
from .models import ParticipationModel, ParticipationTypeModel


# Create your views here.
class ListParticipationTypeAPIView(ListAPIView):
    """List all participation types that are active for that day"""
    queryset = ParticipationTypeModel.objects.filter(
        from_date__lte=datetime.today().date(),
        to_date__gte=datetime.today().date(),
    )
    serializer_class = ParticipationTypeModelSerializer


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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    parser_classes = (FormParser, MultiPartParser,)
    serializer_class = AddParticipationModelSerializer


class UpdateParticipationAPIView(UpdateAPIView):
    """
        Update the participation whose id has been passed through the request
        The participation must be for the current user
    """
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = get_object_or_404(ParticipationModel, pk=kwargs['pk'], user=request.user)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(data=serializer.data, status=status.HTTP_200_OK)

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
            annotate(total_points=Sum('points'))

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
            annotate(total_points=Sum('points'))

        queryset = liste_leaderboard.order_by('-total_points')[:contest.nb_element_leaderboard]\
            if contest.nb_element_leaderboard else liste_leaderboard.order_by('-total_points')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    serializer_class = LeaderBoardSerializer


class ListStatAPIView(ListAPIView):
    """ Globals Stats"""
    def list(self, request, *args, **kwargs):
        return Response(get_list_stats_date(get_object_or_404(ContestsModel, pk=kwargs['contest_id'])))


class ListMyStatAPIView(ListAPIView):
    """ My Stats"""
    def list(self, request, *args, **kwargs):
        return Response(get_list_stats_date(get_object_or_404(ContestsModel, pk=kwargs['contest_id']), request.user))


class ListDateForContestAPIView(ListAPIView):
    """ List of contest dates"""
    def list(self, request, *args, **kwargs):
        return Response(get_list_contest_date(get_object_or_404(ContestsModel, pk=kwargs['contest_id'])))


def get_list_stats_date(contest, user=None):
    list_date = get_list_contest_date(contest)
    stats_for_users = ParticipationModel.objects.filter(is_to_considered_for_day=True, is_approved=True). \
        exclude(user__office=None, user__is_active=True). \
        values_list('contest__name', 'user__office', 'user__display_name', 'date', 'points', 'user'). \
        order_by('user__display_name', 'contest__name', 'date'). \
        annotate(total_points=Sum('points'))

    if user:
        stats_for_users = stats_for_users.filter(user=user)

    result = {}
    for element in stats_for_users:
        result.setdefault(element[2], {}).setdefault(element[3], element[5])

    for el in result:
        # Set points to 0 on all dates where the user did not participate
        result[el].update({x: 0 for x in list_date if x not in result[el]})
        # Sort by date
        result[el] = sorted(result[el].items(), key=lambda x: x[0])
    return result

def get_list_contest_date(contest):
    return [contest.start_date + timedelta(days=x) for x in range((contest.end_date - contest.start_date).days)]


