class ModerationPermissions:
    """
        Moderator permission in admin board.
        Administrator has all moderator permissions
    """

    # pylint: disable=unused-argument
    def has_delete_permission(self, request, obj=None):
        """
            Delete permissions for moderator and admin
        """
        return False

    # pylint: disable=unused-argument
    def has_add_permission(self, request, obj=None):
        """
            Add permissions for moderator and admin
        """
        return False

    # pylint: disable=unused-argument
    def has_change_permission(self, request, obj=None):
        """
            Edit permissions for moderator and admin
        """
        return False

    # pylint: disable=unused-argument
    def has_module_permission(self, request, obj=None):
        """
            List permissions for moderator and admin
        """
        return (request.user.is_moderator() or request.user.is_admin()) if request.user.is_authenticated else False


class AdminPermissions(ModerationPermissions):
    """
        Administrator permission in admin board.
    """

    def has_change_permission(self, request, obj=None):
        """
            Edit permissions for admin only
        """
        return request.user.is_admin() if request.user.is_authenticated else False

    def has_module_permission(self, request, obj=None):
        """
            List permissions for admin only
        """
        return request.user.is_admin() if request.user.is_authenticated else False
