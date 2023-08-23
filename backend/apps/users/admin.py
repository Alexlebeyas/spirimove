from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from rest_framework.authtoken.models import TokenProxy

from .models import User, Role


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    fieldsets = (
        (None, {'fields': ('display_name', 'phone', 'password',)}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'office',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ['email', 'display_name', 'first_name', 'last_name', 'office', 'group_list', 'role_list',
                    'image_displayed', 'is_superuser']
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    def image_displayed(self, obj):
        if obj.profile_picture:
            return format_html(
                f"<a target='_blank' href='{obj.profile_picture.url}'><img height='100px' width='100px' src='{obj.profile_picture.url}'></a>")
        return "/"

    def group_list(self, obj):
        return ' / '.join([group.name for group in obj.groups.all()])

    def role_list(self, obj):
        return ' / '.join([role.role for role in obj.roles.all()])

    def has_module_permission(self, request):
        if request.user.is_authenticated:
            return request.user.is_superuser
        return False


@admin.register(Role)
class RoleModelAdmin(admin.ModelAdmin):
    list_display = ['role', 'is_default']

    def has_module_permission(self, request):
        return False


admin.site.unregister(Group)
admin.site.unregister(TokenProxy)
