from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from .serializers import ListParticipationModelSerializer, ParticipationTypeModelSerializer, AddParticipationModelSerializer
from .models import ParticipationModel, ParticipationTypeModel
from django.shortcuts import get_object_or_404
from datetime import datetime


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
