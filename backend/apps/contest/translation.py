from modeltranslation.translator import register, TranslationOptions

from .models import ContestsModel


@register(ContestsModel)
class ContestsModelTranslationOptions(TranslationOptions):
    fields = ('name',)
