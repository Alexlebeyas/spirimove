from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from .serializers import ParticipationModelSerializer
from .models import ParticipationModel


# Create your views here.
class ListParticipationAPIView(ListAPIView):
    """Lists all task from the database"""
    queryset = ParticipationModel.objects.all()
    serializer_class = ParticipationModelSerializer


class CreateParticipationAPIView(CreateAPIView):
    """Creates a new task"""
    parser_classes = (FormParser, MultiPartParser,)
    queryset = ParticipationModel.objects.all()
    serializer_class = ParticipationModelSerializer


class UpdateParticipationAPIView(UpdateAPIView):
    """Update the task whose id has been passed through the request"""
    queryset = ParticipationModel.objects.all()
    serializer_class = ParticipationModelSerializer


class DeleteParticipationAPIView(DestroyAPIView):
    """Deletes the task whose id has been passed through the request"""
    queryset = ParticipationModel.objects.all()
    serializer_class = ParticipationModelSerializer