from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from .serializers import UserModelSerializer, UserModelUpdateSerializer
from .models import User


# Create your views here.
class MyProfileIView(ListAPIView):
    """Display profile for current user"""
    def list(self, request, *args, **kwargs):
        queryset = User.objects.filter(pk=request.user.pk)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    serializer_class = UserModelSerializer


class UpdateProfileAPIView(UpdateAPIView):
    """
        Update the participation whose id has been passed through the request
        The participation must be for the current user
    """
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    parser_classes = (FormParser, MultiPartParser,)
    serializer_class = UserModelUpdateSerializer


class AllOffices(ListAPIView):
    """Diplay list of offices"""
    def list(self, request, *args, **kwargs):
        list_office = User.objects.exclude(office=None).values_list('office', flat=True).distinct()
        return Response(list_office)
