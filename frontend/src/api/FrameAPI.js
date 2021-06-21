import axios from "axios";
import { HOST, JSONConfig, MultipartConfig, thumbnailToItem, contentToItem } from "./apiBase"

class FrameAPI {
    getFrames = (priority) => {
        if (priority === undefined) {
            return axios.get(
                `${HOST}/api/frames/`, JSONConfig()
            )
        }
        return axios.get(
            `${HOST}/api/frames/?priority=${priority}`, JSONConfig()
        )
    }

    getMaxPriority = () => {
        return axios.get(
            `${HOST}/api/frames/max_priority/`, JSONConfig()
        )
    }

    uploadFrame = (
        frame
    ) => {
        const origin_thumbnail = frame.origin_thumbnail
        const default_thumbnail = frame.default_thumbnail
        const mini_thumbnail = frame.mini_thumbnail
        const normal_content_file = frame.normal_content.content_file
        const large_content_file = frame.large_content.content_file

        const form = new FormData()
        form.append("origin_thumbnail", origin_thumbnail.file, origin_thumbnail.file.name)
        form.append("default_thumbnail", default_thumbnail.file, default_thumbnail.file.name)
        form.append("mini_thumbnail", mini_thumbnail.file, mini_thumbnail.file.name)

        const data = {
            owner_id: frame.user.id,
            title: frame.title,
            priority: frame.priority,
            scale_type: frame.scale_type,
            contents: [],
            thumbnails: [
                thumbnailToItem(origin_thumbnail),
                thumbnailToItem(default_thumbnail),
                thumbnailToItem(mini_thumbnail),
            ]
        }

        if (frame.repeat_mode !== null) {
            data["repeat_mode"] = frame.repeat_mode
        }

        if (normal_content_file !== null) {
            form.append("normal_content", normal_content_file, normal_content_file.name)
            data["contents"].push(contentToItem(frame.normal_content))
        }

        if (large_content_file !== null) {
            form.append("large_content", large_content_file, large_content_file.name)
            data["contents"].push(contentToItem(frame.large_content))
        }

        form.append("data", JSON.stringify(data))

        return axios.post(
            `${HOST}/api/frames/`, form, MultipartConfig()
        )
    }

    updateFrame = (
        origin,
        frame
    ) => {
        const origin_thumbnail = frame.origin_thumbnail
        const default_thumbnail = frame.default_thumbnail
        const mini_thumbnail = frame.mini_thumbnail
        const normal_content_file = frame.normal_content.file
        const large_content_file = frame.large_content.file

        const form = new FormData()
        const data = {
            contents: [],
            thumbnails: [],
            delete_contents: [],
        }

        if (frame.user.id !== origin.user.id) {
            data["owner_id"] = frame.user.id
        }
        if (frame.title !== origin.title) {
            data["title"] = frame.title
        }
        if (frame.scale_type !== origin.scale_type) {
            data["scale_type"] = frame.scale_type
        }
        if (frame.repeat_mode !== origin.repeat_mode) {
            data["repeat_mode"] = frame.repeat_mode
        }
        if (frame.priority !== origin.priority) {
            data["priority"] = frame.priority
        }

        if (
            origin_thumbnail.file !== null &&
            default_thumbnail.file !== null &&
            mini_thumbnail.file !== null
        ) {
            form.append("origin_thumbnail", origin_thumbnail.file, origin_thumbnail.file.name)
            form.append("default_thumbnail", default_thumbnail.file, default_thumbnail.file.name)
            form.append("mini_thumbnail", mini_thumbnail.file, mini_thumbnail.file.name)
            data["thumbnails"] = [
                thumbnailToItem(origin_thumbnail),
                thumbnailToItem(default_thumbnail),
                thumbnailToItem(mini_thumbnail),
            ]
        }

        if (normal_content_file !== null) {
            form.append("normal_content", normal_content_file, normal_content_file.name)
            data["contents"].push(
                contentToItem(frame.normal_content)
            )
        }

        if (large_content_file !== null) {
            form.append("large_content", large_content_file, large_content_file.name)
            data["contents"].push(
                contentToItem(frame.large_content)
            )
        }

        if (
            frame.normal_content.content === "" &&
            frame.normal_content.content !== origin.normal_content.content) {
            data["delete_contents"].push("normal")
        }

        if (
            frame.large_content.content === "" &&
            frame.large_content.content !== origin.large_content.content) {
            data["delete_contents"].push("large")
        }

        form.append("data", JSON.stringify(data))

        return axios.put(
            `${HOST}/api/frames/detail/${origin.id}/`, form, MultipartConfig()
        )
    }

    updateOrder = (
        origin_frames,
        frames
    ) => {
        const orders = frames.map((item, index) => {
            return {
                id: item.id,
                order: origin_frames.get(index).order,
                updated: item.updated
            }
        }).filter((item) => {
            const origin = origin_frames.find(o => o.id === item.id)
            return origin !== undefined && item.order !== origin.order
        }).toJS()

        return axios.put(
            `${HOST}/api/frames/`, orders, JSONConfig()
        )
    }

    deleteFrame = (
        frame_id
    ) => {
        return axios.delete(
            `${HOST}/api/frames/detail/${frame_id}/`, JSONConfig()
        )
    }
}

export default new FrameAPI();