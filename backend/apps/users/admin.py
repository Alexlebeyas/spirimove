from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _
from .models import User, Role
from rest_framework.authtoken.models import TokenProxy


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    fieldsets = (
        (None, {'fields': ('display_name', 'phone', 'password', )}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide', ),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ['email', 'display_name', 'first_name', 'last_name', 'office', 'group_list', 'role_list', 'is_superuser']
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email', )

    def group_list(self, obj):
        return ' / '.join([group.name for group in obj.groups.all()])

    def role_list(self, obj):
        return ' / '.join([role.role for role in obj.roles.all()])

    def has_module_permission(self, request):
        if request.user.is_authenticated:
            return request.user.is_superuser or request.user.is_admin()
        return False


@admin.register(Role)
class RoleModelAdmin(admin.ModelAdmin):
    list_display = ['role', 'is_default']

    def has_module_permission(self, request):
        return False

admin.site.unregister(Group)
admin.site.unregister(TokenProxy)
