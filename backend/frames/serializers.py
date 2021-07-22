from django.core.files.base import ContentFile
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from users import serializers as user_serializers
from users import models as user_models
from . import models


class ThemeFrameThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ThemeFrameThumbnail
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


class ThemeFrameContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ThemeFrameContent
        fields = (
            "screen_size",
            "content",
            "content_type",
            "width",
            "height",
            "updated",
            "created",
        )

        read_only_fields = ["content", "updated", "created"]


class UpdateThemeFrameOrderSerializer(serializers.ListSerializer):
    def update(self, instances, validated_data):
        frame_mapping = {frame.id: frame for frame in instances}
        data_mapping = {item["id"]: item for item in validated_data}

        ret = []

        for frame_id, data in data_mapping.items():
            frame = frame_mapping.get(frame_id, None)
            if frame is not None:
                frame.order = data["order"]
                ret.append(frame)

        models.ThemeFrame.objects.bulk_update(ret, ["order"])

        return ret


class ThemeFrameOrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField()

    class Meta:
        model = models.ThemeFrame
        fields = (
            "id",
            "order",
            "updated",
        )
        list_serializer_class = UpdateThemeFrameOrderSerializer

    def validate(self, data):
        id = data.get("id")
        frame = models.ThemeFrame.objects.get_or_none(id=id)
        if frame is None:
            raise ValidationError("프레임이 존재 하지 않습니다.")

        if frame.updated != data.get("updated"):
            raise ValidationError("업데이트 시점이 일치하지 않습니다.")

        return data


class ThemeFrameSerializer(serializers.ModelSerializer):
    files = None

    owner = user_serializers.UserSerializer(required=False)

    owner_id = serializers.CharField(max_length=20, write_only=True)

    thumbnails = ThemeFrameThumbnailSerializer(many=True, write_only=True)
    contents = ThemeFrameContentSerializer(many=True, write_only=True)
    orders = ThemeFrameOrderSerializer(many=True, write_only=True, required=False)
    delete_contents = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    origin_thumbnail = serializers.SerializerMethodField()
    default_thumbnail = serializers.SerializerMethodField()
    mini_thumbnail = serializers.SerializerMethodField()

    content_type = serializers.SerializerMethodField()
    normal_content = serializers.SerializerMethodField()
    large_content = serializers.SerializerMethodField()

    class Meta:
        model = models.ThemeFrame
        fields = (
            "id",
            "title",
            "dominant_color",
            "scale_type",
            "repeat_mode",
            "priority",
            "is_verified",
            "is_pending",
            "is_public",
            "thumbnails",
            "contents",
            "delete_contents",
            "order",
            "price",
            "owner",
            "owner_id",
            "orders",
            "content_type",
            "origin_thumbnail",
            "default_thumbnail",
            "mini_thumbnail",
            "normal_content",
            "large_content",
            "updated",
            "created",
        )
        read_only_fields = (
            "id",
            "owner",
            "order",
            "origin_thumbnail",
            "default_thumbnail",
            "mini_thumbnail",
            "content_type",
            "normal_content",
            "large_content",
            "updated",
            "created",
        )
        extra_kwargs = {
            "is_verified": {"required": False},
            "is_pending": {"required": False},
        }

    def __init__(self, *args, **kwargs):
        if "files" in kwargs:
            self.files = kwargs.pop("files", None)
        super(ThemeFrameSerializer, self).__init__(*args, **kwargs)

    def get_thumbnail(self, obj, size):
        thumbnail = obj.thumbnails.filter(image_size_type=size).first()
        if thumbnail is None:
            return None
        return ThemeFrameThumbnailSerializer(thumbnail).data

    def get_origin_thumbnail(self, obj):
        return self.get_thumbnail(
            obj, models.ThemeFrameThumbnail.IMAGE_SIZE_TYPE_ORIGIN
        )

    def get_default_thumbnail(self, obj):
        return self.get_thumbnail(
            obj, models.ThemeFrameThumbnail.IMAGE_SIZE_TYPE_DEFAULT
        )

    def get_mini_thumbnail(self, obj):
        return self.get_thumbnail(obj, models.ThemeFrameThumbnail.IMAGE_SIZE_TYPE_MINI)

    def validate_thumbnails(self, value):
        for thumbnail_data in value:
            if self.files is None:
                raise ValidationError("업로드된 파일이 존재하지 않습니다.")
            image_size = thumbnail_data["image_size_type"]
            thumbnail = self.files.get(f"{image_size}_thumbnail", None)
            if thumbnail is None:
                raise ValidationError(f"{image_size} 썸네일이 존재하지 않습니다.")
            thumbnail_data["image"] = ContentFile(thumbnail.read(), name=thumbnail.name)
        return value

    def get_content(self, obj, size):
        content = obj.contents.filter(screen_size=size).first()
        if content is None:
            return None
        return ThemeFrameContentSerializer(content).data

    def get_normal_content(self, obj):
        return self.get_content(obj, models.ThemeFrameContent.SCREEN_SIZE_NORMAL)

    def get_large_content(self, obj):
        return self.get_content(obj, models.ThemeFrameContent.SCREEN_SIZE_LARGE)

    def validate_contents(self, value):
        for content_data in value:
            if self.files is None:
                raise ValidationError("업로드된 파일이 존재하지 않습니다.")
            screen_size = content_data["screen_size"]
            content = self.files.get(f"{screen_size}_content", None)
            if content is None:
                raise ValidationError(f"{screen_size} 컨텐츠가 존재하지 않습니다.")
            content_data["content"] = ContentFile(content.read(), name=content.name)
        return value

    def get_content_type(self, obj):
        content = obj.contents.first()
        if content is None:
            return ""
        return content.content_type

    def validate_owner_id(self, value):
        owner = user_models.User.objects.get_or_none(id=value)
        if owner is None:
            raise ValidationError("User가 존재 하지 않습니다.")
        return owner

    def create(self, validated_data):
        if "delete_contents" in validated_data:
            validated_data.pop("delete_contents")

        thumbnails_data = validated_data.pop("thumbnails", [])
        contents_data = validated_data.pop("contents", [])

        orders_data = validated_data.pop("orders", None)

        if "owner_id" in validated_data:
            validated_data["owner"] = validated_data.pop("owner_id", None)

        frame = models.ThemeFrame.objects.create(
            **validated_data,
        )

        if orders_data is not None:
            models.ThemeFrame.objects.update_orders(
                frame=frame,
                orders_data=orders_data,
            )

        for thumbnail_data in thumbnails_data:
            models.ThemeFrameThumbnail.objects.save_data(
                frame=frame,
                **thumbnail_data,
            )

        for content_data in contents_data:
            models.ThemeFrameContent.objects.save_data(
                frame=frame,
                **content_data,
            )

        return frame

    def update(self, instance, validated_data):
        delete_contents = validated_data.pop("delete_contents", [])

        thumbnails_data = validated_data.pop("thumbnails", [])
        contents_data = validated_data.pop("contents", [])

        orders_data = validated_data.pop("orders", None)

        if "owner_id" in validated_data:
            validated_data["owner"] = validated_data.pop("owner_id", None)

        models.ThemeFrame.objects.update_data(
            instance=instance,
            **validated_data,
        )

        if orders_data is not None:
            models.ThemeFrame.objects.update_orders(
                orders_data=orders_data,
            )

        for thumbnail_data in thumbnails_data:
            models.ThemeFrameThumbnail.objects.save_data(
                frame=instance,
                **thumbnail_data,
            )

        for content_data in contents_data:
            models.ThemeFrameContent.objects.save_data(
                frame=instance,
                **content_data,
            )

        for delete_content in delete_contents:
            models.ThemeFrameContent.objects.filter(
                frame=instance,
                screen_size=delete_content,
            ).delete()

        return instance
