from pprint import pprint
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from users import serializers as user_serializers
from themes import models as theme_models, serializers as theme_serializers
from curations import models as curation_models
from . import models


class ThemeListCurationSerializer(serializers.ModelSerializer):
    group_id = serializers.SerializerMethodField()
    group_title = serializers.SerializerMethodField()
    group_view_type = serializers.SerializerMethodField()
    folder_id = serializers.SerializerMethodField()
    folder_title = serializers.SerializerMethodField()

    class Meta:
        model = models.ThemeList
        fields = (
            "group_id",
            "group_title",
            "group_view_type",
            "folder_id",
            "folder_title",
        )

    def get_group_id(self, obj):
        return obj.group.id

    def get_group_title(self, obj):
        return obj.group.title

    def get_group_view_type(self, obj):
        return obj.group.view_type

    def get_folder_id(self, obj):
        if obj.folder is None:
            return ""
        return obj.folder.id

    def get_folder_title(self, obj):
        if obj.folder is None:
            return ""
        return obj.folder.title


class ThemeSerializer(serializers.ModelSerializer):
    theme_id = serializers.ReadOnlyField(source="id")
    owner = user_serializers.UserSerializer()

    curations = serializers.SerializerMethodField()

    origin_thumbnail = serializers.SerializerMethodField()
    default_thumbnail = serializers.SerializerMethodField()
    mini_thumbnail = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField()

    class Meta:
        model = theme_models.Theme
        fields = (
            "theme_id",
            "title",
            "curations",
            "owner",
            "origin_thumbnail",
            "default_thumbnail",
            "mini_thumbnail",
            "content_type",
            "updated",
            "created",
        )

    def get_curations(self, obj):
        lis = models.ThemeList.objects.filter(theme=obj)
        if not lis.exists():
            return []
        return ThemeListCurationSerializer(lis, many=True).data

    def get_thumbnail(self, obj, size):
        thumbnail = obj.thumbnails.filter(image_size_type=size).first()
        if thumbnail is None:
            return ""
        return theme_serializers.ThemeThumbnailSerializer(thumbnail).data

    def get_origin_thumbnail(self, obj):
        return self.get_thumbnail(
            obj, theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_ORIGIN
        )

    def get_default_thumbnail(self, obj):
        return self.get_thumbnail(
            obj, theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_DEFAULT
        )

    def get_mini_thumbnail(self, obj):
        return self.get_thumbnail(obj, theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_MINI)

    def get_content_type(self, obj):
        content = obj.contents.first()
        if content is None:
            return ""
        return content.content_type


class ThemeInThemeListSerializer(serializers.ModelSerializer):
    theme_id = serializers.ReadOnlyField(source="theme.id")
    title = serializers.ReadOnlyField(source="theme.title")

    owner = serializers.SerializerMethodField()

    curations = serializers.SerializerMethodField()

    origin_thumbnail = serializers.SerializerMethodField()
    default_thumbnail = serializers.SerializerMethodField()
    mini_thumbnail = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField()

    class Meta:
        model = models.ThemeList
        fields = (
            "id",
            "theme_id",
            "title",
            "order",
            "curations",
            "owner",
            "origin_thumbnail",
            "default_thumbnail",
            "mini_thumbnail",
            "content_type",
            "updated",
            "created",
        )

    def get_owner(self, obj):
        return user_serializers.UserSerializer(obj.theme.owner).data

    def get_curations(self, obj):
        # lis = models.ThemeList.objects.filter(theme=obj)
        lis = obj.theme.lists
        if not lis.exists():
            return []
        return ThemeListCurationSerializer(lis, many=True).data

    def get_thumbnail(self, obj, size):
        thumbnail = obj.thumbnails.filter(image_size_type=size).first()
        if thumbnail is None:
            return ""
        return theme_serializers.ThemeThumbnailSerializer(thumbnail).data

    def get_origin_thumbnail(self, obj):
        return self.get_thumbnail(
            obj.theme, theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_ORIGIN
        )

    def get_default_thumbnail(self, obj):
        return self.get_thumbnail(
            obj.theme, theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_DEFAULT
        )

    def get_mini_thumbnail(self, obj):
        return self.get_thumbnail(
            obj.theme, theme_models.ThemeThumbnail.IMAGE_SIZE_TYPE_MINI
        )

    def get_content_type(self, obj):
        content = obj.theme.contents.first()
        if content is None:
            return ""
        return content.content_type


class ThemeListSerializer(serializers.ModelSerializer):
    group_id = serializers.CharField(write_only=True)
    folder_id = serializers.CharField(write_only=True, allow_blank=True)
    theme_id = serializers.CharField(write_only=True)

    class Meta:
        model = models.ThemeList
        fields = (
            "id",
            "theme",
            "group",
            "folder",
            "order",
            "theme_id",
            "group_id",
            "folder_id",
            "updated",
            "created",
        )
        read_only_fields = (
            "id",
            "theme",
            "group",
            "folder",
            "order",
            "updated",
            "created",
        )

    def validate_group_id(self, value):
        group = curation_models.ThemeCurationGroup.objects.get_or_none(id=value)
        if group is None:
            raise ValidationError("존재하지 않는 그룹입니다.")
        return group

    def validate_folder_id(self, value):
        if value == "":
            return None

        folder = curation_models.ThemeCurationFolder.objects.get_or_none(id=value)
        if folder is None:
            raise ValidationError("존재하지 않는 폴더입니다.")
        return folder

    def validate_theme_id(self, value):
        theme = theme_models.Theme.objects.get_or_none(id=value)
        if theme is None:
            raise ValidationError("존재하지 않는 그룹입니다.")
        return theme

    def validate(self, data):
        if "group_id" in data:
            data["group"] = data.pop("group_id", None)
        if "folder_id" in data:
            data["folder"] = data.pop("folder_id", None)
        if "theme_id" in data:
            data["theme"] = data.pop("theme_id", None)
        return data

    def create(self, validated_data):
        li = models.ThemeList.objects.save_data(**validated_data)
        return li

    def update(self, instance, validated_data):
        li = models.ThemeList.objects.save_data(
            instance=instance,
            **validated_data,
        )
        return li


class UpdateThemeListOrderSerializer(serializers.ListSerializer):
    def update(self, instances, validated_data):
        list_mapping = {li.id: li for li in instances}
        data_mapping = {item["id"]: item for item in validated_data}

        ret = []

        for li_id, data in data_mapping.items():
            li = list_mapping.get(li_id, None)
            if li is not None:
                li.order = data["order"]
                ret.append(li)

        models.ThemeList.objects.bulk_update(ret, ["order"])

        return ret


class ThemeListOrderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = models.ThemeList
        fields = (
            "id",
            "order",
            "updated",
        )
        list_serializer_class = UpdateThemeListOrderSerializer

    def validate(self, data):
        li = models.ThemeList.objects.get_or_none(id=data.get("id"))
        if li is None:
            raise ValidationError("존재하지 않는 리스트입니다.")

        if li.updated != data.get("updated"):
            raise ValidationError("업데이트 시점이 일치하지 않습니다.")

        return data
