from rest_framework import serializers
from .models import User


class UserModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'phone', 'office', 'display_name')


class UserModelUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('office',)
