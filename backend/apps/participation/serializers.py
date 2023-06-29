from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from apps.users.serializers import UserModelSerializer

from .models import ParticipationModel, ParticipationTypeModel


class ListParticipationModelSerializer(serializers.ModelSerializer):
    user = UserModelSerializer(many=False)
    class Meta:
        model = ParticipationModel
        read_only_fields = ('user',)
        exclude = ('is_to_considered_for_day', 'points', 'is_approved')


class AddParticipationModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParticipationModel
        exclude = ('is_to_considered_for_day', 'user', 'points', 'is_approved', 'date_created', 'last_modified')

    def validate(self, data):
        """
            Check that the type of participation is active today.
        """
        if ('type' in data) and not (data['type'].from_date <= data['date'] <= data['type'].to_date):
            raise serializers.ValidationError({"type": _("The type of participation chosen is not active on this date")})

        if not (data['contest'].start_date <= data['date'] <= data['contest'].end_date and data['contest'].is_open):
            raise serializers.ValidationError({"date": _("The date does not match this Spiri-Move")})
        return data


class ParticipationTypeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipationTypeModel
        fields = ('id', 'name', 'description', 'from_date', 'to_date')


class LeaderBoardSerializer(serializers.Serializer):
    user__display_name = serializers.CharField(max_length=500)
    user__profile_picture = serializers.CharField(max_length=500)
    user__office = serializers.CharField(max_length=200)
    contest__name = serializers.CharField(max_length=200)
    total_points = serializers.CharField(max_length=200)
    total_days = serializers.CharField(max_length=200)
