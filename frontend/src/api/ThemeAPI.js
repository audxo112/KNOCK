import axios from "axios"
import { HOST, JSONConfig, MultipartConfig, thumbnailToItem, preloadContentToItem } from "./apiBase"


class ThemeAPI {
    getThemes = (
        page
    ) => {
        const params = {
            page: page,
            offset: 20,
        }

        return axios.get(
            `${HOST}/api/themes/editor/`, JSONConfig(params)
        )
    }

    getRecentLinks = (
    ) => {
        return axios.get(
            `${HOST}/api/themes/recent/links/`, JSONConfig()
        )
    }

    uploadTheme = (
        theme,
    ) => {
        const origin_thumbnail = theme.origin_thumbnail
        const default_thumbnail = theme.default_thumbnail
        const mini_thumbnail = theme.mini_thumbnail
        const normal_content = theme.normal_content
        const large_content = theme.large_content
        const normal_preload_file = normal_content.preload_file
        const normal_content_file = normal_content.content_file
        const large_preload_file = large_content.preload_file
        const large_content_file = large_content.content_file

        const tags = theme.tags.map(tag => {
            return { tag: tag.tag }
        }).toJS()

        const form = new FormData()
        form.append("origin_thumbnail", origin_thumbnail.file, origin_thumbnail.file.name)
        form.append("default_thumbnail", default_thumbnail.file, default_thumbnail.file.name)
        form.append("mini_thumbnail", mini_thumbnail.file, mini_thumbnail.file.name)

        const data = {
            title: theme.title,
            dominant_color: theme.dominant_color,
            tags: tags,
            link: theme.link,
            owner_id: theme.user.id,
            post_start_datetime: `${theme.post_start}T09:00:00.0`,
            post_end_datetime: `${theme.post_end}T09:00:00.0`,
            contents: [],
            thumbnails: [
                thumbnailToItem(theme.origin_thumbnail),
                thumbnailToItem(theme.default_thumbnail),
                thumbnailToItem(theme.mini_thumbnail),
            ]
        }

        console.log("test")
        console.log(theme.dominant_color)

        if (normal_preload_file !== null && normal_content_file !== null) {
            form.append("normal_preload", normal_preload_file, normal_preload_file.name)
            form.append("normal_content", normal_content_file, normal_content_file.name)
            data["contents"].push(preloadContentToItem(theme.normal_content))
        }
        if (large_preload_file !== null && large_content_file !== null) {
            form.append("large_preload", large_preload_file, large_preload_file.name)
            form.append("large_content", large_content_file, large_content_file.name)
            data["contents"].push(preloadContentToItem(theme.large_content))
        }

        if (theme.group) {
            data["group"] = theme.group.id
            if (theme.group.view_type !== "List")
                data["folder"] = theme.folder.id
        }
        form.append("data", JSON.stringify(data))

        return axios.post(
            `${HOST}/api/themes/upload/`, form, MultipartConfig()
        )
    }

    updateTheme = (
        origin,
        theme,
    ) => {
        const origin_thumbnail = theme.origin_thumbnail
        const default_thumbnail = theme.default_thumbnail
        const mini_thumbnail = theme.mini_thumbnail
        const normal_content = theme.normal_content
        const large_content = theme.large_content
        const normal_preload_file = normal_content.preload_file
        const normal_content_file = normal_content.content_file
        const large_preload_file = large_content.preload_file
        const large_content_file = large_content.content_file

        const form = new FormData()
        const data = {
            contents: [],
            thumbnails: [],
            delete_contents: [],
        }

        var tagChanged = origin.tags.size !== theme.tags.size
        if (!tagChanged) {
            origin.tags.forEach(ov => {
                const tag = theme.tags.find(tag => tag.tag === ov.tag)
                if (!tag) {
                    tagChanged = true
                }
            })
        }

        if (theme.title !== origin.title) {
            data["title"] = theme.title
        }
        if (theme.dominant_color !== origin.dominant_color) {
            data["dominant_color"] = theme.dominant_color
        }
        if (tagChanged) {
            const tags = theme.tags.map(tag => {
                return {
                    id: tag.id,
                    tag: tag.tag
                }
            }).toJS()
            data["tags"] = tags
        }
        if (theme.link !== origin.link) {
            data["link"] = theme.link
        }
        if (theme.user.id !== origin.user.id) {
            data["owner_id"] = theme.user.id
        }
        if (theme.post_start !== origin.post_start) {
            data["post_start_datetime"] = `${theme.post_start}T09:00:00.0`
        }
        if (theme.post_end !== origin.post_end) {
            data["post_end_datetime"] = `${theme.post_end}T09:00:00.0`
        }

        if (normal_preload_file !== null && normal_content_file !== null) {
            form.append("normal_preload", normal_preload_file, normal_preload_file.name)
            form.append("normal_content", normal_content_file, normal_content_file.name)
            data["contents"].push(preloadContentToItem(theme.normal_content))
        }
        if (large_preload_file !== null && large_content_file !== null) {
            form.append("large_preload", large_preload_file, large_preload_file.name)
            form.append("large_content", large_content_file, large_content_file.name)
            data["contents"].push(preloadContentToItem(theme.large_content))
        }

        if (origin_thumbnail.file !== null && default_thumbnail.file !== null && mini_thumbnail.file !== null) {
            form.append("origin_thumbnail", origin_thumbnail.file, origin_thumbnail.file.name)
            form.append("default_thumbnail", default_thumbnail.file, default_thumbnail.file.name)
            form.append("mini_thumbnail", mini_thumbnail.file, mini_thumbnail.file.name)

            data["thumbnails"] = [
                thumbnailToItem(theme.origin_thumbnail),
                thumbnailToItem(theme.default_thumbnail),
                thumbnailToItem(theme.mini_thumbnail),
            ]
        }

        if (
            theme.normal_content.content === "" &&
            theme.normal_content.content !== origin.normal_content.content) {
            data["delete_contents"].push("normal")
        }

        if (
            theme.large_content.content === "" &&
            theme.large_content.content !== origin.large_content.content) {
            data["delete_contents"].push("large")
        }

        form.append("data", JSON.stringify(data))
        return axios.put(
            `${HOST}/api/themes/detail/${theme.id}/`, form, MultipartConfig()
        )
    }

    deleteTheme = (
        theme
    ) => {
        return axios.delete(
            `${HOST}/api/themes/detail/${theme.id}/`, JSONConfig()
        )
    }

    search = (
        value
    ) => {
        return axios.get(
            `${HOST}/api/themes/search/${value}/`, JSONConfig()
        )
    }

    searchTag = (
        value
    ) => {
        return axios.get(
            `${HOST}/api/themes/tags/search/${value}/`, JSONConfig()
        )
    }
}

export default new ThemeAPI();