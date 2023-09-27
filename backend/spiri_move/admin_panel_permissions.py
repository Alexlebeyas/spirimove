class ModerationPermissions:
    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False

    def has_module_permission(self, request):
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


class AdminPermissions(ModerationPermissions):

    def has_change_permission(self, request, obj=None):
        return request.user.is_admin() if request.user.is_authenticated else False

    def has_module_permission(self, request):
        return request.user.is_admin() if request.user.is_authenticated else False
