from django.urls import path
from . import views

urlpatterns = [
    path("all/contests/", views.ListContestAPIView.as_view(), name="contest_list"),
]
