from core import managers


class FrameManager(managers.CustomManager):
    def update_data(self, instance, **kwargs):
        if instance is None:
            return None

        instance.is_verified = kwargs.get("is_verified", instance.is_verified)
        instance.is_pending = kwargs.get("is_pending", instance.is_pending)
        instance.is_public = kwargs.get("is_public", instance.is_public)
        instance.dominant_color = kwargs.get("dominant_color", instance.dominant_color)
        instance.title = kwargs.get("title", instance.title)
        instance.scale_type = kwargs.get("scale_type", instance.scale_type)
        instance.repeat_mode = kwargs.get("repeat_mode", instance.repeat_mode)
        instance.priority = kwargs.get("priority", instance.priority)
        instance.owner = kwargs.get("owner", instance.owner)
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


class ThumbnailManager(managers.CustomManager):
    def save_data(self, frame, **kwargs):
        image_size_type = kwargs.get("image_size_type")
        instance = self.filter(
            frame=frame,
            image_size_type=image_size_type,
        ).first()

        if instance is None:
            instance = self.create(
                frame=frame,
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


class ContentManager(managers.CustomManager):
    def save_data(self, frame, **kwargs):
        screen_size = kwargs.get("screen_size")
        instance = self.get_or_none(
            frame=frame,
            screen_size=screen_size,
        )
        if instance is None:
            instance = self.create(
                frame=frame,
                **kwargs,
            )
        else:
            instance.screen_size = kwargs.get("screen_size", instance.screen_size)
            instance.content = kwargs.get("content", instance.content)
            instance.content_type = kwargs.get("content_type", instance.content_type)
            instance.width = kwargs.get("width", instance.width)
            instance.height = kwargs.get("height", instance.height)
            instance.save()

        return instance
