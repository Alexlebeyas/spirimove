from django.urls import path
from . import views

urlpatterns = [
    path("all/participations_type/", views.ListParticipationTypeAPIView.as_view(), name="participations_type"),
    path("all/participations/", views.ListAllParticipationAPIView.as_view(), name="all_participations_list"),
    path("my/participations/", views.ListMyParticipationAPIView.as_view(), name="my_participations_list"),
    path("create/participation/", views.CreateParticipationAPIView.as_view(), name="participations_create"),
    path("update/participation/<int:pk>/", views.UpdateParticipationAPIView.as_view(), name="update_participation"),
    path("delete/participation/<int:pk>/", views.DeleteParticipationAPIView.as_view(), name="delete_participation")
]