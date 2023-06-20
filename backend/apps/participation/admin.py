from django.contrib import admin
from django.utils.html import format_html
from .models import *


@admin.register(ParticipationModel)
class ParticipationModelAdmin(admin.ModelAdmin):
    list_display = ['contest_name', 'name', 'description', 'intensity', 'date', 'image_displayed']

    def contest_name(self, obj):
        return obj.participationcontest.name

    def image_displayed(self, obj):
        return format_html(f"<img height='100px' width='100px' src='{obj.image.url}'>")
