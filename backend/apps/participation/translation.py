from modeltranslation.translator import register, TranslationOptions

from .models import ParticipationTypeModel, LevelModel


@register(ParticipationTypeModel)
class ParticipationTypeModelTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(LevelModel)
class LevelModelTranslationOptions(TranslationOptions):
    fields = ('name',)
