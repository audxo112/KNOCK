from pprint import pprint
from django.core.files.base import ContentFile
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from lists import models as list_models
from . import models


class FolderMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ThemeCurationFolder
        fields = (
            "id",
            "title",
        )


class GroupMenuSerializer(serializers.ModelSerializer):
    folders = FolderMenuSerializer(many=True)

    class Meta:
        model = models.ThemeCurationGroup
        fields = (
            "id",
            "title",
            "view_type",
            "folders",
        )


class UpdateGroupsOrderSerializer(serializers.ListSerializer):
    def update(self, instances, validated_data):
        group_mapping = {group.id: group for group in instances}
        data_mapping = {item["id"]: item for item in validated_data}

        ret = []

        for group_id, data in data_mapping.items():
            group = group_mapping.get(group_id, None)
            if group is not None:
                group.order = data["order"]
                ret.append(group)

        models.ThemeCurationGroup.objects.bulk_update(ret, ["order"])

        return ret


class GroupOrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(allow_blank=True)

    class Meta:
        model = models.ThemeCurationGroup
        fields = (
            "id",
            "order",
            "updated",
        )
        extra_kwargs = {
            "updated": {"required": False},
        }
        list_serializer_class = UpdateGroupsOrderSerializer

    def validate(self, data):
        group_id = data.get("id")
        if group_id == "":
            return data

        group = models.ThemeCurationGroup.objects.get_or_none(id=group_id)
        if group is None:
            raise ValidationError("존재하지 않는 그룹입니다.")

        if group.updated != data.get("updated"):
            raise ValidationError("업데이트 시점이 일치하지 않습니다.")

        return data


class GroupSerializer(serializers.ModelSerializer):
    orders = GroupOrderSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = models.ThemeCurationGroup
        fields = (
            "id",
            "title",
            "order",
            "view_type",
            "post_start_datetime",
            "post_end_datetime",
            "orders",
            "updated",
            "created",
        )
        read_only_fields = (
            "id",
            "order",
            "updated",
            "created",
        )

    def create(self, validated_data):
        orders_data = validated_data.pop("orders", None)

        group = models.ThemeCurationGroup.objects.create(
            **validated_data,
        )

        if orders_data is not None and len(orders_data) > 0:
            models.ThemeCurationGroup.objects.update_orders(
                instance=group,
                orders_data=orders_data,
            )

        return group

    def update(self, instance, validated_data):
        orders_data = validated_data.pop("orders", None)

        models.ThemeCurationGroup.objects.update_data(
            instance=instance,
            **validated_data,
        )

        if orders_data is not None and len(orders_data) > 0:
            models.ThemeCurationGroup.objects.update_orders(
                orders_data=orders_data,
            )

        return instance


class UpdateFoldersOrderSerializer(serializers.ListSerializer):
    def update(self, instances, validated_data):
        folder_mapping = {folder.id: folder for folder in instances}
        data_mapping = {item["id"]: item for item in validated_data}

        ret = []

        for folder_id, data in data_mapping.items():
            folder = folder_mapping.get(folder_id, None)
            if folder is not None:
                folder.order = data["order"]
                ret.append(folder)

        models.ThemeCurationFolder.objects.bulk_update(ret, ["order"])

        return ret


class FolderOrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(allow_blank=True)

    class Meta:
        model = models.ThemeCurationFolder
        fields = (
            "id",
            "order",
            "updated",
        )
        extra_kwargs = {
            "updated": {"required": False},
        }
        list_serializer_class = UpdateFoldersOrderSerializer

    def validate(self, data):
        folder_id = data.get("id")
        if folder_id == "":
            return data

        folder = models.ThemeCurationFolder.objects.get_or_none(id=folder_id)
        if folder is None:
            raise ValidationError("존재하지 않는 폴더입니다.")

        if folder.updated != data.get("updated"):
            raise ValidationError("업데이트 시점이 일치하지 않습니다.")

        return data


class FolderCoverSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ThemeCurationFolderCover
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


class FolderSerializer(serializers.ModelSerializer):
    group_id = serializers.CharField(max_length=20, write_only=True)

    covers = FolderCoverSerializer(many=True, write_only=True)
    orders = FolderOrderSerializer(many=True, write_only=True, required=False)

    origin_cover = serializers.SerializerMethodField()
    default_cover = serializers.SerializerMethodField()
    mini_cover = serializers.SerializerMethodField()

    theme_count = serializers.SerializerMethodField()

    class Meta:
        model = models.ThemeCurationFolder
        fields = (
            "id",
            "title",
            "sub_title",
            "description",
            "order",
            "orders",
            "group_id",
            "covers",
            "origin_cover",
            "default_cover",
            "mini_cover",
            "theme_count",
            "updated",
            "created",
        )
        read_only_fields = (
            "id",
            "order",
            "origin_cover",
            "default_cover",
            "mini_cover",
            "theme_count",
            "updated",
            "created",
        )

    def __init__(self, *args, **kwargs):
        if "files" in kwargs:
            self.files = kwargs.pop("files", None)
        super(FolderSerializer, self).__init__(*args, **kwargs)

    def get_cover(self, obj, size):
        cover = obj.covers.filter(image_size_type=size).first()
        if cover is None:
            return ""
        return FolderCoverSerializer(cover).data

    def get_origin_cover(self, obj):
        return self.get_cover(
            obj, models.ThemeCurationFolderCover.IMAGE_SIZE_TYPE_ORIGIN
        )

    def get_default_cover(self, obj):
        return self.get_cover(
            obj, models.ThemeCurationFolderCover.IMAGE_SIZE_TYPE_DEFAULT
        )

    def get_mini_cover(self, obj):
        return self.get_cover(obj, models.ThemeCurationFolderCover.IMAGE_SIZE_TYPE_MINI)

    def validate_covers(self, value):
        for cover_data in value:
            if self.files is None:
                raise ValidationError("업로드된 파일이 존재하지 않습니다.")
            image_size = cover_data["image_size_type"]
            cover = self.files.get(f"{image_size}_cover", None)
            if cover is None:
                raise ValidationError(f"{image_size} 커버가 존재하지 않습니다.")
            cover_data["image"] = ContentFile(cover.read(), name=cover.name)
        return value

    def get_theme_count(self, obj):
        return list_models.ThemeList.objects.filter(folder=obj).count()

    def validate_group_id(self, value):
        group = models.ThemeCurationGroup.objects.get_or_none(id=value)
        if group is None:
            raise ValidationError("Group이 존재 하지 않습니다.")

        if group.view_type == models.ThemeCurationGroup.VIEW_TYPE_LIST:
            raise ValidationError("list 타입엔 폴더를 추가할 수 없습니다.")

        return group

    def create(self, validated_data):
        covers_data = validated_data.pop("covers", [])
        orders_data = validated_data.pop("orders", None)

        if "group_id" in validated_data:
            validated_data["group"] = validated_data.pop("group_id", None)

        folder = models.ThemeCurationFolder.objects.create(
            **validated_data,
        )

        if orders_data is not None and len(orders_data) > 0:
            models.ThemeCurationFolder.objects.update_orders(
                instance=folder,
                orders_data=orders_data,
            )

        for cover_data in covers_data:
            models.ThemeCurationFolderCover.objects.save_data(
                folder=folder,
                **cover_data,
            )

        return folder

    def update(self, instance, validated_data):
        covers_data = validated_data.pop("covers", [])
        orders_data = validated_data.pop("orders", None)

        if "group_id" in validated_data:
            validated_data["group"] = validated_data.pop("group_id", None)

        models.ThemeCurationFolder.objects.update_data(
            instance=instance,
            **validated_data,
        )

        if orders_data is not None and len(orders_data) > 0:
            models.ThemeCurationFolder.objects.update_orders(
                orders_data=orders_data,
            )

        for cover_data in covers_data:
            models.ThemeCurationFolderCover.objects.save_data(
                folder=instance,
                **cover_data,
            )

        return instance
