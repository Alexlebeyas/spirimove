from rest_framework import serializers

from .models import ContestsModel


class ContestsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestsModel
        exclude = ('name_en', 'name_fr', 'date_created', 'last_modified')
