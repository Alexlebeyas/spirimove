from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from .serializers import ContestsModelSerializer
from .models import ContestsModel


# Create your views here.
class ListContestAPIView(ListAPIView):
    """Lists all activity from the database"""
    queryset = ContestsModel.objects.all()
    serializer_class = ContestsModelSerializer


class CreateContestAPIView(CreateAPIView):
    """Creates a new activity"""
    queryset = ContestsModel.objects.all()
    serializer_class = ContestsModelSerializer


class UpdateContestAPIView(UpdateAPIView):
    """Update the activity whose id has been passed through the request"""
    queryset = ContestsModel.objects.all()
    serializer_class = ContestsModelSerializer


class DeleteContestAPIView(DestroyAPIView):
    """Deletes the activity whose id has been passed through the request"""
    queryset = ContestsModel.objects.all()
    serializer_class = ContestsModelSerializer