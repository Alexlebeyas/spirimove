from rest_framework.generics import ListAPIView
from .serializers import ContestsModelSerializer
from .models import ContestsModel


# Create your views here.
class ListContestAPIView(ListAPIView):
    """List all contests who are open"""
    queryset = ContestsModel.objects.filter(is_open=True)
    serializer_class = ContestsModelSerializer
