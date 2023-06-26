from rest_framework import serializers
from .models import ParticipationModel, ParticipationTypeModel
from django.utils.translation import gettext_lazy as _
from datetime import datetime


class ParticipationModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParticipationModel
        exclude = ('user', 'points', 'is_approved', 'date_created', 'last_modified')

    def validate(self, data):
        """
            Check that the type of participation is active today.
        """
        today = datetime.today().date()
        if ('type' in data) and (data['type'].from_date <= today and data['type'].to_date >= today):
            raise serializers.ValidationError({"type": _("The type of participation chosen is no active")})
        return data


class ParticipationTypeModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParticipationTypeModel
        fields = ('id', 'name', 'description', 'from_date', 'to_date')
