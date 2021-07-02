from django.core.files.base import ContentFile
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from . import models


class UserAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Avatar
        fields = (
            "image_size_type",
            "image_type",
            "image",
            "width",
            "height",
            "updated",
            "created",
        )
        read_only_fields = ["image", "updated", "created"]


class UpdateUsersOrderSerializer(serializers.ListSerializer):
    def update(self, instances, validated_data):
        user_mapping = {user.id: user for user in instances}
        data_mapping = {item["id"]: item for item in validated_data}

        ret = []

        for user_id, data in data_mapping.items():
            user = user_mapping.get(user_id, None)
            if user is not None:
                user.order = data["order"]
                ret.append(user)

        models.User.objects.bulk_update(ret, ["order"])

        return ret


class UserOrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField()

    class Meta:
        model = models.User
        fields = (
            "id",
            "order",
            "updated",
        )
        list_serializer_class = UpdateUsersOrderSerializer

    def validate(self, data):
        user = models.User.objects.get_or_none(id=data.get("id"))
        if user is None:
            raise ValidationError("유저가 존재 하지 않습니다.")

        if user.updated != data.get("updated"):
            raise ValidationError("업데이트 시점이 일치하지 않습니다.")

        return data


class UserSerializer(serializers.ModelSerializer):
    files = None

    avatars = UserAvatarSerializer(many=True, write_only=True)

    origin_avatar = serializers.SerializerMethodField()
    default_avatar = serializers.SerializerMethodField()
    mini_avatar = serializers.SerializerMethodField()
    micro_avatar = serializers.SerializerMethodField()

    class Meta:
        model = models.User
        fields = (
            "id",
            "nickname",
            "email",
            "grade",
            "order",
            "is_verified",
            "is_visibility",
            "upload_stop_period",
            "avatars",
            "default_avatar",
            "origin_avatar",
            "mini_avatar",
            "micro_avatar",
            "created",
            "updated",
        )
        read_only_fields = (
            "id",
            "order",
            "default_avatar",
            "origin_avatar",
            "mini_avatar",
            "micro_avatar",
            "created",
            "updated",
        )
        extra_kwargs = {
            "email": {"required": False},
            "is_verified": {"required": False},
            "is_visibility": {"required": False},
            "upload_stop_period": {"required": False},
        }

    def __init__(self, *args, **kwargs):
        if "files" in kwargs:
            self.files = kwargs.pop("files", None)
        super(UserSerializer, self).__init__(*args, **kwargs)

    def get_avatar(self, obj, size):
        avatar = obj.avatars.filter(image_size_type=size).first()
        if avatar is None:
            return ""
        return UserAvatarSerializer(avatar).data

    def get_origin_avatar(self, obj):
        return self.get_avatar(obj, models.Avatar.IMAGE_SIZE_TYPE_ORIGIN)

    def get_default_avatar(self, obj):
        return self.get_avatar(obj, models.Avatar.IMAGE_SIZE_TYPE_DEFAULT)

    def get_mini_avatar(self, obj):
        return self.get_avatar(obj, models.Avatar.IMAGE_SIZE_TYPE_MINI)

    def get_micro_avatar(self, obj):
        return self.get_avatar(obj, models.Avatar.IMAGE_SIZE_TYPE_MICRO)

    def validate_nickname(self, value):
        nickname_value = value.lower()
        if models.User.objects.filter(nickname_value=nickname_value).exists():
            raise ValidationError("중복된 이름이 있습니다.")
        if models.BanNickname.objects.filter(value=nickname_value).exists():
            raise ValidationError("금지된 이름입니다.")
        return value

    def validate_avatars(self, value):
        for avatar_data in value:
            if self.files is None:
                raise ValidationError("업로드된 파일이 존재하지 않습니다.")
            image_size = avatar_data["image_size_type"]
            avatar = self.files.get(f"{image_size}_avatar", None)
            if avatar is None:
                raise ValidationError(f"{image_size} 아바타가 존재하지 않습니다.")
            avatar_data["image"] = ContentFile(avatar.read(), name=avatar.name)
        return value

    def create(self, validated_data):
        avatars_data = validated_data.pop("avatars", [])

        user = models.User.objects.create_editor_user(**validated_data)

        for avatar_data in avatars_data:
            models.Avatar.objects.save_data(
                user=user,
                **avatar_data,
            )

        return user

    def update(self, instance, validated_data):
        avatars_data = validated_data.pop("avatars", [])

        instance = models.User.objects.update_data(
            instance=instance,
            **validated_data,
        )

        for avatar_data in avatars_data:
            models.Avatar.objects.save_data(
                user=instance,
                **avatar_data,
            )

        return instance


class BanNicknameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BanNickname
        fields = (
            "id",
            "nickname",
            "value",
        )
        read_only_fields = ["value"]

    def create(self, validated_data):
        ban = models.BanNickname.objects.create(
            **validated_data,
        )
        return ban
