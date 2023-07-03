from django.contrib import admin, messages
from django.urls import path, reverse
from django.http import HttpResponseRedirect
from django.utils.html import format_html
from .models import *

@admin.register(ContestsModel)
class ActivitiesModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date', 'is_open', 'date_created', 'last_modified', 'draw_action']

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False

    def draw_action(self, obj):
        return format_html(f"<a type='button' href='{reverse('admin:run_draw', args=[obj.id])}' class='addlink'> Run Drawn </a>")

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('draw/<int:contest_id>/', self.run_draw_function, name="run_draw"),
        ]
        return my_urls + urls

    def run_draw_function(self, request, contest_id):
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
