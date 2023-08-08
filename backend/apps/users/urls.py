from django.urls import path

from . import views

urlpatterns = [
    path("my/profile/", views.MyProfileIView.as_view(), name="my_profile"),
    path("update/profile/", views.UpdateProfileAPIView.as_view(), name="update_my_profile"),
    path("all/offices/", views.AllOffices.as_view(), name="all_office"),
]
