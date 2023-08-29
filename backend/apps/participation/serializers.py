from apps.contest.serializers import ContestsModelSerializer
from apps.users.serializers import UserModelSerializer
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .models import ParticipationModel, ParticipationTypeModel, DrawModel, LevelModel


class AddParticipationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipationModel
        exclude = (
            'is_to_considered_for_day', 'user', 'points', 'is_approved', 'date_created', 'last_modified', 'status')

    def __init__(self, *args, **kwargs):
        update_action = kwargs.pop('update_action', None)
        super(AddParticipationModelSerializer, self).__init__(*args, **kwargs)
        instance = kwargs.get('instance')
        if update_action:
            self.fields['image'].required = False

    def validate(self, data):
        """
            Check that the type of participation is active today.
        """

        if 'type' in data and data['type']:
            if (data['type'].from_date and data['type'].to_date) and not (
                    data['type'].from_date <= data['date'] <= data['type'].to_date):
                raise serializers.ValidationError(
                    {"type": _("The type of participation chosen is not active on this date")})

            user_part_with_same_type_for_a_day = ParticipationModel.objects.filter(user=self.context.get('user'),
                                                                                   type=data['type'],
                                                                                   date=data['date']).\
                                                    exclude(pk=None if not self.instance else self.instance.pk)

            if not data['type'].can_add_more_by_day and user_part_with_same_type_for_a_day:
                raise serializers.ValidationError(
                    {"type": _("You can't enter multiple participations of this type on the same day.")})

        if not (data['contest'].start_date <= data['date'] <= data['contest'].end_date and data['contest'].is_open):
            raise serializers.ValidationError({"date": _("The date does not match this Spiri-Move")})
        return data


class ParticipationTypeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipationTypeModel
        fields = ('id', 'name', 'description', 'from_date', 'to_date', 'can_be_intensive')


class ListParticipationModelSerializer(serializers.ModelSerializer):
    user = UserModelSerializer(many=False)
    type = ParticipationTypeModelSerializer(many=False)
    status_display = serializers.CharField(
        source='get_status_display'
    )

    class Meta:
        model = ParticipationModel
        read_only_fields = ('user',)
        exclude = ('is_to_considered_for_day', 'status', 'is_approved', 'last_modified')


class LevelModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelModel
        read_only_fields = ('name', 'price', 'participation_day', 'order')
        exclude = ('is_active', 'date_created', 'last_modified')


class LeaderBoardSerializer(serializers.Serializer):
    user__display_name = serializers.CharField(max_length=500)
    user__profile_picture = serializers.CharField(max_length=500)
    user__office = serializers.CharField(max_length=200)
    contest__name = serializers.CharField(max_length=200)
    total_points = serializers.CharField(max_length=200)
    total_days = serializers.CharField(max_length=200)


class DrawModelSerializer(serializers.ModelSerializer):
    contest = ContestsModelSerializer(many=False)
    winner = UserModelSerializer(many=False)
    level = LevelModelSerializer(many=False)

    class Meta:
        model = DrawModel
        fields = ('contest', 'winner', 'level')
