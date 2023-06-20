from rest_framework import serializers
from .models import ContestsModel

class ContestsModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContestsModel
        exclude = ('date_created', 'last_modified', 'is_open')