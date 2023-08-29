from django.urls import path

from . import views

urlpatterns = [
    path("all/participations_type/", views.ListParticipationTypeAPIView.as_view(), name="participations_type"),
    path("all/participations/", views.ListAllParticipationAPIView.as_view(), name="all_participations_list"),
    path("all/level/", views.ListLevelAPIView.as_view(), name="all_level_list"),
    path("all/leaderboard/<int:contest_id>/", views.ListleaderBoardAPIView.as_view(), name="all_leaderboard_list"),
    path("all/stats/dates/<int:contest_id>/", views.ListDateForContestAPIView.as_view(), name="all_stats_dates_list"),
    path("all/stats/<int:contest_id>/", views.ListStatAPIView.as_view(), name="all_stats_list"),
    path("draw/results/<int:contest_id>/", views.DrawResultAPIView.as_view(), name="draw_results"),
    path("my/office/leaderboard/<int:contest_id>/", views.ListMyOfficeleaderBoardAPIView.as_view(),
         name="my_office_leaderboard_list"),
    path("my/participations/", views.ListMyParticipationAPIView.as_view(), name="my_participations_list"),
    path("my/stats/<int:contest_id>/", views.ListMyStatAPIView.as_view(), name="my_stats_list"),
    path("create/participation/", views.CreateParticipationAPIView.as_view(), name="participations_create"),
    path("update/participation/<int:pk>/", views.UpdateParticipationAPIView.as_view(), name="update_participation"),
    path("delete/participation/<int:pk>/", views.DeleteParticipationAPIView.as_view(), name="delete_participation"),
    path("reaction/participation/", views.ToggleReactionAPIView.as_view(), name="participation_reaction")
]
