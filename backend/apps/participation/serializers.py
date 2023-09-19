from apps.contest.serializers import ContestsModelSerializer
from apps.users.serializers import UserModelSerializer
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from django.core.files.storage import default_storage

from .models import ParticipationModel, ParticipationTypeModel, DrawModel, LevelModel, ReactionModel

class AddParticipationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipationModel
        exclude = ('user', 'points', 'date_created', 'last_modified', 'status')

    def __init__(self, *args, **kwargs):
        super(AddParticipationModelSerializer, self).__init__(*args, **kwargs)
        participation_type = ParticipationTypeModel.objects.get(pk=self.initial_data.get("type"))
        if participation_type.should_set_image and not (self.instance and self.instance.image):
            self.fields['image'].required = True

    def validate(self, data):
        """
            Validate the paticipation data
        """
        self.validate_date_field(data)
        self.validate_type_field(data)
        self.validate_multiple_participations(data)
        return data

    def validate_date_field(self, data):
        """
            Check is the participation date correspond to contest period.
        """
        if not (data['contest'].start_date <= data['date'] <= data['contest'].end_date and data['contest'].is_open):
            raise serializers.ValidationError({"date": _("The date does not match this Spiri-Move")})

    def validate_type_field(self, data):
        """
            Check is the participation date correspond to type period.
            If the type doesn't have a defined period, it won't run.
        """
        if (data['type'].from_date and data['type'].to_date) and not (
                data['type'].from_date <= data['date'] <= data['type'].to_date):
            raise serializers.ValidationError(
                {"type": _("The type of participation chosen is not active on this date")})

    def validate_multiple_participations(self, data):
        """
            Check if it is a multiple participation for the same type
            for the same day, and if the chosen type approves it.
        """
        user_part_with_same_type_for_a_day = ParticipationModel.objects.filter(user=self.context.get('user'),
                                                                               type=data['type'], date=data['date']). \
            exclude(pk=None if not self.instance else self.instance.pk)

        if not data['type'].can_add_more_by_day and user_part_with_same_type_for_a_day:
            raise serializers.ValidationError(
                {"type": _("You have already entered a participation with type {} for this day.").format(
                    data['type'].name)})


class ParticipationTypeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipationTypeModel
        fields = ('id', 'name', 'description', 'from_date', 'to_date', 'can_be_intensive', 'can_have_organizer',
                  'should_set_image')


class ReactionsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReactionModel
        fields = ('id', 'participation', 'reaction')


class ListParticipationModelSerializer(serializers.ModelSerializer):
    user = UserModelSerializer(many=False)
    type = ParticipationTypeModelSerializer(many=False)
    reactions = serializers.SerializerMethodField()
    status_display = serializers.CharField(
        source='get_status_display'
    )

    class Meta:
        model = ParticipationModel
        read_only_fields = ('user',)
        exclude = ('status', 'last_modified')

    def get_reactions(self, obj):
        return ReactionModel.objects.filter(participation__pk=obj.pk).values('user__display_name', 'reaction')


class LevelModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelModel
        read_only_fields = ('name', 'price', 'participation_day', 'order', 'is_for_office')
        exclude = ('name_fr', 'name_en', 'is_active', 'date_created', 'last_modified')


class LeaderBoardSerializer(serializers.Serializer):
    user__display_name = serializers.CharField(max_length=500)
    user__profile_picture = serializers.CharField(max_length=500)
    user__office = serializers.CharField(max_length=200)
    total_points = serializers.CharField(max_length=200)
    total_days = serializers.CharField(max_length=200)
    max_consecutive_days = serializers.CharField(max_length=200)

    def to_representation(self, instance):        
        data = super().to_representation(instance)
        request = self.context
        data['user__profile_picture'] = request.build_absolute_uri(
            default_storage.url(data['user__profile_picture'])) if data['user__profile_picture'] else None
        return data


class DrawModelSerializer(serializers.ModelSerializer):
    contest = ContestsModelSerializer(many=False)
    winner = UserModelSerializer(many=False)
    level = LevelModelSerializer(many=False)

    class Meta:
        model = DrawModel
        fields = ('contest', 'winner', 'level', 'total_days')
