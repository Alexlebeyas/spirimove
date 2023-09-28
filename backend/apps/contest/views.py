from rest_framework.generics import ListAPIView
from .serializers import ContestsModelSerializer
from .models import ContestsModel


# Create your views here.
class ListContestAPIView(ListAPIView):
    """List all contests who are open"""
    def get_queryset(self):
        return ContestsModel.current_contest.all()
    serializer_class = ContestsModelSerializer
