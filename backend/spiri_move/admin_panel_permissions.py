class ModerationPermissions:
    """
        Moderator permission in admin board.
        Administrator has all moderator permissions
    """
    def has_delete_permission(self, request):
        """
            Delete permissions for moderator and admin
        """
        return False

    def has_add_permission(self, request):
        """
            Add permissions for moderator and admin
        """
        return False

    def has_change_permission(self, request):
        """
            Edit permissions for moderator and admin
        """
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False

    def has_module_permission(self, request):
        """
            List permissions for moderator and admin
        """
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


class AdminPermissions(ModerationPermissions):
    """
        Administrator permission in admin board.
    """
    def has_change_permission(self, request):
        """
            Edit permissions for admin only
        """
        return request.user.is_admin() if request.user.is_authenticated else False

    def has_module_permission(self, request):
        """
            List permissions for admin only
        """
        return request.user.is_admin() if request.user.is_authenticated else False
