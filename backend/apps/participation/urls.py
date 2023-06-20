from django.urls import path
from . import views

urlpatterns = [
    path("all/participations/", views.ListParticipationAPIView.as_view(), name="participations_list"),
    path("create/participation/", views.CreateParticipationAPIView.as_view(), name="participations_create"),
    path("update/participation/<int:pk>/", views.UpdateParticipationAPIView.as_view(), name="update_participation"),
    path("delete/participation/<int:pk>/", views.DeleteParticipationAPIView.as_view(), name="delete_participation")
]