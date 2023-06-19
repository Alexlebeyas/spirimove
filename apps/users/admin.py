from django.contrib import admin
from .models import User, Role

@admin.register(User)
class UserModelAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'is_staff']

@admin.register(Role)
class RoleModelAdmin(admin.ModelAdmin):
    list_display = ['pk', 'role', 'is_default']