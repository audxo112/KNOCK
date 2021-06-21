import pprint
from core import managers


class UserManager(managers.CustomUserManager):
    def create_editor_user(self, **kwargs):
        user = self.create(**kwargs)
        user.is_editor = True
        user.is_usable_editor = True
        user.is_verified = True
        user.save(using=self._db)
        return user

    def update_data(self, instance, **kwargs):
        if instance is None:
            return None

        pprint.pprint(kwargs)

        instance.nickname = kwargs.get("nickname", instance.nickname)
        instance.email = kwargs.get("email", instance.email)
        instance.grade = kwargs.get("grade", instance.grade)
        instance.is_visibility = kwargs.get("is_visibility", instance.is_visibility)
        instance.is_verified = kwargs.get("is_verified", instance.is_verified)
        instance.is_usable_editor = kwargs.get(
            "is_usable_editor", instance.is_usable_editor
        )
        instance.upload_stop_period = kwargs.get(
            "upload_stop_period", instance.upload_stop_period
        )
        instance.save()

        return instance


class AvatarManager(managers.CustomManager):
    def save_data(self, user, **kwargs):
        instance = self.filter(
            user=user,
            image_size_type=kwargs.get("image_size_type"),
        ).first()

        if instance is None:
            instance = self.create(
                user=user,
                **kwargs,
            )
        else:
            instance.image_size_type = kwargs.get(
                "image_size_type", instance.image_size_type
            )
            instance.image_type = kwargs.get("image_type", instance.image_type)
            instance.image = kwargs.get("image", instance.image)
            instance.width = kwargs.get("width", instance.width)
            instance.height = kwargs.get("height", instance.height)
            instance.save()

        return instance
