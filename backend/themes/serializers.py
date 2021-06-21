from django.core.files.base import ContentFile
from rest_framework import serializers
from rest_framework.validators import ValidationError
from users import serializers as user_serializers
from users import models as user_models
from lists import models as list_models
from curations import models as curation_models
from . import models


class ThemeThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ThemeThumbnail
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


class ThemeContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ThemeContent
        fields = (
            "screen_size",
            "preload",
            "preload_type",
            "content",
            "content_type",
            "width",
            "height",
            "updated",
            "created",
        )
        read_only_fields = ["preload", "content", "updated", "created"]


class TagSerializer(serializers.ModelSerializer):
    used_count = serializers.SerializerMethodField()

    class Meta:
        model = models.ThemeTag
        fields = (
            "id",
            "tag",
            "used_count",
        )
        read_only_fields = ("id", "used_count")

    def get_used_count(self, obj):
        return obj.themes.count()


class ThemeSerializer(serializers.ModelSerializer):
    files = None

    tags = TagSerializer(many=True)
    owner = user_serializers.UserSerializer(required=False)

    owner_id = serializers.CharField(max_length=20, write_only=True)
    group = serializers.CharField(max_length=20, write_only=True, required=False)
    folder = serializers.CharField(max_length=20, write_only=True, required=False)

    contents = ThemeContentSerializer(many=True, write_only=True, required=False)
    thumbnails = ThemeThumbnailSerializer(many=True, write_only=True, required=False)
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
        model = models.Theme
        fields = (
            "id",
            "title",
            "link",
            "is_verified",
            "is_confirm",
            "is_pending",
            "post_start_datetime",
            "post_end_datetime",
            "owner",
            "owner_id",
            "group",
            "folder",
            "tags",
            "contents",
            "thumbnails",
            "delete_contents",
            "origin_thumbnail",
            "default_thumbnail",
            "mini_thumbnail",
            "content_type",
            "normal_content",
            "large_content",
            "updated",
            "created",
        )
        read_only_fields = (
            "id",
            "owner",
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
            "is_confirm": {"required": False},
            "is_pending": {"required": False},
        }

    def __init__(self, *args, **kwargs):
        if "files" in kwargs:
            self.files = kwargs.pop("files")
        super(ThemeSerializer, self).__init__(*args, **kwargs)

    def get_thumbnail(self, obj, size):
        thumbnail = obj.thumbnails.filter(image_size_type=size).first()
        if thumbnail is None:
            return ""
        return ThemeThumbnailSerializer(thumbnail).data

    def get_origin_thumbnail(self, obj):
        return self.get_thumbnail(obj, models.ThemeThumbnail.IMAGE_SIZE_TYPE_ORIGIN)

    def get_default_thumbnail(self, obj):
        return self.get_thumbnail(obj, models.ThemeThumbnail.IMAGE_SIZE_TYPE_DEFAULT)

    def get_mini_thumbnail(self, obj):
        return self.get_thumbnail(obj, models.ThemeThumbnail.IMAGE_SIZE_TYPE_MINI)

    def get_content_type(self, obj):
        content = obj.contents.first()
        if content is None:
            return ""
        return content.content_type

    def get_content(self, obj, size):
        content = obj.contents.filter(screen_size=size).first()
        if content is None:
            return ""
        return ThemeContentSerializer(content).data

    def get_normal_content(self, obj):
        return self.get_content(obj, models.ThemeContent.SCREEN_SIZE_NORMAL)

    def get_large_content(self, obj):
        return self.get_content(obj, models.ThemeContent.SCREEN_SIZE_LARGE)

    def validate_owner_id(self, value):
        owner = user_models.User.objects.get_or_none(id=value)
        if owner is None:
            raise ValidationError("User가 존재 하지 않습니다.")
        return owner

    def validate_group(self, value):
        group = curation_models.ThemeCurationGroup.objects.get_or_none(id=value)
        if group is None:
            raise ValidationError("Group이 존재 하지 않습니다.")
        return group

    def validate_folder(self, value):
        folder = curation_models.ThemeCurationFolder.objects.get_or_none(id=value)
        if folder is None:
            raise ValidationError("Folder가 존재 하지 않습니다.")
        return folder

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

    def validate_contents(self, value):
        for content_data in value:
            if self.files is None:
                raise ValidationError("업로드된 파일이 존재하지 않습니다.")
            screen_size = content_data["screen_size"]
            preload = self.files.get(f"{screen_size}_preload", None)
            if preload is None:
                raise ValidationError(f"{screen_size} 프리로드가 존재하지 않습니다.")
            content = self.files.get(f"{screen_size}_content", None)
            if content is None:
                raise ValidationError(f"{screen_size} 컨텐츠가 존재하지 않습니다.")
            content_data["preload"] = ContentFile(preload.read(), name=preload.name)
            content_data["content"] = ContentFile(content.read(), name=content.name)
        return value

    def create(self, validated_data):
        if "delete_contents" in validated_data:
            validated_data.pop("delete_contents")

        thumbnails_data = validated_data.pop("thumbnails", [])
        contents_data = validated_data.pop("contents", [])
        tags = validated_data.pop("tags", [])

        group = validated_data.pop("group", None)
        folder = validated_data.pop("folder", None)

        validated_data["owner"] = validated_data.pop("owner_id", None)

        theme = models.Theme.objects.create(**validated_data)

        models.ThemeTag.objects.save_data(theme, tags)

        for thumbnail_data in thumbnails_data:
            models.ThemeThumbnail.objects.save_data(
                theme=theme,
                **thumbnail_data,
            )

        for content_data in contents_data:
            models.ThemeContent.objects.save_data(
                theme=theme,
                **content_data,
            )

        list_models.ThemeList.objects.save_data(
            theme=theme,
            group=group,
            folder=folder,
        )

        return theme

    def update(self, instance, validated_data):
        delete_contents = validated_data.pop("delete_contents", [])

        thumbnails_data = validated_data.pop("thumbnails", [])
        contents_data = validated_data.pop("contents", [])
        tags = validated_data.pop("tags", None)

        if "owner_id" in validated_data:
            validated_data["owner"] = validated_data.pop("owner_id", None)

        models.Theme.objects.update_data(
            instance=instance,
            **validated_data,
        )

        if tags is not None:
            models.ThemeTag.objects.save_data(instance, tags)

        for thumbnail_data in thumbnails_data:
            models.ThemeThumbnail.objects.save_data(
                theme=instance,
                **thumbnail_data,
            )

        for content_data in contents_data:
            models.ThemeContent.objects.save_data(
                theme=instance,
                **content_data,
            )

        for delete_content in delete_contents:
            models.ThemeContent.objects.filter(
                theme=instance,
                screen_size=delete_content,
            ).delete()

        return instance
