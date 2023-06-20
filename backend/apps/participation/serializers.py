from rest_framework import serializers
from .models import ParticipationModel


class ParticipationModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParticipationModel
        exclude = ('date_created', 'last_modified')