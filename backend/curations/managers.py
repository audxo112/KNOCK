from core import managers


class GroupManager(managers.CustomManager):
    def update_data(self, instance, **kwargs):
        if instance is None:
            return None

        instance.title = kwargs.get("title", instance.title)
        instance.post_start_datetime = kwargs.get(
            "post_start_datetime", instance.post_start_datetime
        )
        instance.post_end_datetime = kwargs.get(
            "post_end_datetime", instance.post_end_datetime
        )
        instance.save()

        return instance

    def update_orders(self, instance, orders_data):
        new_order = None
        if instance is not None:
            new_order = instance.order

        ret = []
        for order_data in orders_data:
            if instance is not None and order_data["id"] == "":
                g = instance
            else:
                g = self.get_or_none(pk=order_data["id"])

            if g is not None:
                if new_order is not None and order_data["order"] == 0:
                    g.order = new_order
                else:
                    g.order = order_data["order"]
                ret.append(g)

        return self.bulk_update(ret, ["order"])


class FolderManager(managers.CustomManager):
    def update_data(self, instance, **kwargs):
        if instance is None:
            return None

        instance.title = kwargs.get("title", instance.title)
        instance.sub_title = kwargs.get("sub_title", instance.sub_title)
        instance.description = kwargs.get("description", instance.description)
        instance.dominant_color = kwargs.get("dominant_color", instance.dominant_color)
        instance.save()

        return instance

    def update_orders(self, instance, orders_data):
        new_order = None
        if instance is not None:
            new_order = instance.order

        ret = []
        for order_data in orders_data:
            if instance is not None and order_data["id"] == "":
                f = instance
            else:
                f = self.get_or_none(pk=order_data["id"])

            if f is not None:
                if new_order is not None and order_data["order"] == 0:
                    f.order = new_order
                else:
                    f.order = order_data["order"]
                ret.append(f)

        return self.bulk_update(ret, ["order"])


class CoverManager(managers.CustomManager):
    def save_data(self, folder, **kwargs):
        image_size_type = kwargs.get("image_size_type")
        instance = self.filter(
            folder=folder,
            image_size_type=image_size_type,
        ).first()

        if instance is None:
            instance = self.create(
                folder=folder,
                **kwargs,
            )
        else:
            instance.image_size_type = image_size_type
            instance.image_type = kwargs.get("image_type", instance.image_type)
            instance.image = kwargs.get("image", instance.image)
            instance.width = kwargs.get("width", instance.width)
            instance.height = kwargs.get("height", instance.height)
            instance.save()

        return instance
