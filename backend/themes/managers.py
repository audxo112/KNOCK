from core import managers


class ThemeManager(managers.CustomManager):
    def update_data(self, instance, **kwargs):
        if instance is None:
            return None

        instance.title = kwargs.get("title", instance.title)
        instance.link = kwargs.get("link", instance.link)
        instance.is_allow_download = kwargs.get(
            "is_allow_download", instance.is_allow_download
        )
        instance.is_verified = kwargs.get("is_verified", instance.is_verified)
        instance.is_pending = kwargs.get("is_pending", instance.is_pending)
        instance.is_public = kwargs.get("is_public", instance.is_public)
        instance.dominant_color = kwargs.get("dominant_color", instance.dominant_color)
        instance.post_start_datetime = kwargs.get(
            "post_start_datetime", instance.post_start_datetime
        )
        instance.post_end_datetime = kwargs.get(
            "post_end_datetime", instance.post_end_datetime
        )
        instance.owner = kwargs.get("owner", instance.owner)
        instance.save()

        return instance


class TagManger(managers.CustomManager):
    def save_data(self, theme, tag_datas):
        if theme is None:
            return None

        tags = [self.get_or_create(tag=tag["tag"])[0] for tag in tag_datas]

        theme.tags.set(tags)
        theme.save()

        return tags


class ThumbnailManager(managers.CustomManager):
    def save_data(self, theme, **kwargs):
        image_size_type = kwargs.get("image_size_type")
        instance = self.filter(
            theme=theme,
            image_size_type=image_size_type,
        ).first()

        if instance is None:
            instance = self.create(
                theme=theme,
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
    def save_data(self, theme, **kwargs):
        screen_size = kwargs.get("screen_size")
        instance = self.filter(
            theme=theme,
            screen_size=screen_size,
        ).first()

        if instance is None:
            instance = self.create(
                theme=theme,
                **kwargs,
            )
        else:
            instance.screen_size = kwargs.get("screen_size", instance.screen_size)
            instance.preload = kwargs.get("preload", instance.preload)
            instance.preload_type = kwargs.get("preload_type", instance.preload_type)
            instance.content = kwargs.get("content", instance.content)
            instance.content_type = kwargs.get("content_type", instance.content_type)
            instance.width = kwargs.get("width", instance.width)
            instance.height = kwargs.get("height", instance.height)
            instance.save()

        return instance
