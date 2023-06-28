from django.contrib import admin
from .models import *

@admin.register(ContestsModel)
class ActivitiesModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date', 'is_open', 'date_created', 'last_modified']

    def has_module_permission(self, request):
        if request.user.is_authenticated:
            return request.user.is_admin()
        return True
