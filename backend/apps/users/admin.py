from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import Group
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import TokenProxy
from spiri_move.admin_panel_permissions import AdminPermissions

from .models import User


@admin.register(User)
class UserAdmin(AdminPermissions, DjangoUserAdmin):
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
    list_display = ['email', 'display_name', 'first_name', 'last_name', 'office', 'group_list',
                    'image_displayed', 'is_superuser']
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    readonly_fields = ('last_login', 'date_joined')

    def image_displayed(self, obj):
        if obj.profile_picture:
            return format_html(
                f"<a target='_blank' href='{obj.profile_picture.url}'>"
                f"<img height='100px' width='100px' src='{obj.profile_picture.url}'></a>")
        return "/"

    def group_list(self, obj):
        return ' / '.join([group.name for group in obj.groups.all()])


admin.site.unregister(Group)
admin.site.unregister(TokenProxy)
