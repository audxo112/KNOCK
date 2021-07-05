from rest_framework.permissions import BasePermission
from themes import models as theme_models
from frames import models as frame_models


class IsEditor(BasePermission):
    """
    Allows access only to authenticated editor users.
    """

    def has_permission(self, request, view):
        print(request.user)
        return bool(
            request.user and request.user.is_authenticated and request.user.is_editor
        )


class IsOneselfOrEditor(BasePermission):
    """
    Allows access only to authenticated oneself or editor users.
    """

    def has_permission(self, request, view):
        if not (bool(request.user and request.user.is_authenticated)):
            return False

        if request.user.is_editor:
            return True

        user_id = view.kwargs.get("user_id")
        return request.user.id == user_id


class IsThemeOwnerOrEditor(BasePermission):
    """
    Allows access only to authenticated oneself or editor users.
    """

    def has_permission(self, request, view):
        if not (bool(request.user and request.user.is_authenticated)):
            return False

        if request.user.is_editor:
            return True

        theme_id = view.kwargs.get("theme_id")
        theme = theme_models.Theme.objects.get_or_none(id=theme_id)
        if theme is None:
            return False

        return request.user.id == theme.owner.id


class IsFrameOwnerOrEditor(BasePermission):
    """
    Allows access only to authenticated oneself or editor users.
    """

    def has_permission(self, request, view):
        if not (bool(request.user and request.user.is_authenticated)):
            return False

        if request.user.is_editor:
            return True

        frame_id = view.kwargs.get("frame_id")
        frame = frame_models.ThemeFrame.objects.get_or_none(id=frame_id)
        if frame is None:
            return False

        return request.user.id == frame.owner.id
