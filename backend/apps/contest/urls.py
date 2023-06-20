from django.urls import path
from . import views

urlpatterns = [
    path("all/contests/", views.ListContestAPIView.as_view(), name="contest_list"),
    path("create/contest/", views.CreateContestAPIView.as_view(), name="contest_create"),
    path("update/contest/<int:pk>/", views.UpdateContestAPIView.as_view(), name="update_contest"),
    path("delete/contest/<int:pk>/", views.DeleteContestAPIView.as_view(), name="delete_contest")
]