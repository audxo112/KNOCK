from rest_framework.exceptions import ValidationError
from core import managers
from curations import models as curation_models


class ThemeListManager(managers.CustomManager):
    def save_data(self, instance=None, **kwargs):
        if instance is None:
            theme = kwargs.get("theme", None)
            group = kwargs.get("group", None)
            folder = kwargs.get("folder", None)

            if theme is None or group is None:
                return None

            if group.view_type == curation_models.ThemeCurationGroup.VIEW_TYPE_LIST:
                if self.filter(theme=theme, group=group).exists():
                    raise ValidationError("이미 존재하는 리스트입니다.")

                return self.create(theme=theme, group=group)

            if folder is None:
                raise ValidationError("폴더가 존재 하지 않습니다.")

            if folder.group != group:
                raise ValidationError("그룹에 맞지 않는 폴더 입니다.")

            if self.filter(theme=theme, group=group, folder=folder).exists():
                raise ValidationError("이미 존재하는 리스트입니다.")

            return self.create(theme=theme, group=group, folder=folder)
        else:
            group = kwargs.get("group", instance.group)
            folder = kwargs.get("folder", instance.folder)

            if group.view_type == curation_models.ThemeCurationGroup.VIEW_TYPE_LIST:
                instance.group = group
                instance.folder = None
            else:
                if folder.group != group:
                    raise ValidationError("그룹에 맞지 않는 폴더 입니다.")

                instance.group = group
                instance.folder = folder

            instance.save()

        return instance

    def update_orders(self, instance, orders_data):
        new_order = None
        if instance is not None:
            new_order = instance.order

        ret = []
        for order_data in orders_data:
            if instance is not None and order_data["id"] == "":
                li = instance
            else:
                li = self.get_or_none(pk=order_data["id"])

            if li is not None:
                if new_order is not None and order_data["order"] == 0:
                    li.order = new_order
                else:
                    li.order = order_data["order"]
                ret.append(li)

        return self.bulk_update(ret, ["order"])
