import axios from "axios";
import { HOST, JSONConfig, MultipartConfig, thumbnailToItem } from "./apiBase"


class CurationAPI {
    getCurations = () => {
        return axios.get(
            `${HOST}/api/curations/menu/`, JSONConfig()
        )
    }

    getGroups = (isActive) => {
        if (isActive === undefined) {
            return axios.get(
                `${HOST}/api/curations/group/`, JSONConfig()
            )
        }

        return axios.get(
            `${HOST}/api/curations/group/?is_active=${isActive}`, JSONConfig()
        )
    }

    uploadGroup = (
        origin_groups,
        groups,
        group
    ) => {
        const orders = groups.map((item, index) => {
            return {
                id: item.id,
                order: origin_groups.get(index).order,
                updated: item.updated
            }
        }).filter((item) => {
            const origin = origin_groups.find(o => o.id === item.id)
            return origin && origin.order !== item.order
        }).toJS()

        return axios.post(
            `${HOST}/api/curations/group/`, {
            title: group.title,
            post_start_datetime: `${group.post_start_datetime}T09:00:00.0`,
            post_end_datetime: `${group.post_end_datetime}T09:00:00.0`,
            view_type: group.view_type,
            orders: orders
        }, JSONConfig()
        )
    }

    updateGroup = (
        origin_groups,
        groups,
        group,
        group_index,
    ) => {
        const orders = groups.map((item, index) => {
            return {
                id: item.id,
                order: origin_groups.get(index).order,
                updated: item.updated
            }
        }).filter((item) => {
            const origin = origin_groups.find(o => o.id === item.id)
            return origin !== undefined && item.order !== origin.order
        }).toJS()

        if (group_index === null) {
            return axios.put(
                `${HOST}/api/curations/group/`, orders, JSONConfig()
            )
        }

        const updateData = {}
        const origin = origin_groups.find(item => item.id === group.id)

        if (group.title !== origin.title)
            updateData["title"] = group.title
        if (group.post_start_datetime !== origin.post_start_datetime) {
            const start = group.post_start_datetime.split("T")
            updateData["post_start_datetime"] = `${start[0]}T${start.length > 1 ? start[1] : "09:00:00.0"}`
        }
        if (group.post_end_datetime !== origin.post_end_datetime) {
            const end = group.post_end_datetime.split("T")
            updateData["post_end_datetime"] = `${end[0]}T${end.length > 1 ? end[1] : "09:00:00.0"}`
        }
        if (orders.length > 0)
            updateData["orders"] = orders

        return axios.put(
            `${HOST}/api/curations/group/${group.id}/`, updateData, JSONConfig()
        )
    }

    deleteGroup = (
        id
    ) => {
        return axios.delete(
            `${HOST}/api/curations/group/${id}/`, JSONConfig()
        )
    }

    getFolders = (group_id) => {
        if (group_id === undefined) {
            return axios.get(
                `${HOST}/api/curations/folder/`, JSONConfig()
            )
        }

        return axios.get(
            `${HOST}/api/curations/folder/?group_id=${group_id}`, JSONConfig()
        )
    }

    uploadFolder = (
        group,
        origin_folders,
        folders,
        folder,
    ) => {
        const origin_cover = folder.origin_cover
        const default_cover = folder.default_cover
        const mini_cover = folder.mini_cover
        const micro_cover = folder.micro_cover

        const form = new FormData()
        form.append("origin_cover", origin_cover.file, origin_cover.file.name)
        form.append("default_cover", default_cover.file, default_cover.file.name)
        form.append("mini_cover", mini_cover.file, mini_cover.file.name)
        form.append("micro_cover", micro_cover.file, micro_cover.file.name)

        const orders = folders.map((item, index) => {
            return {
                id: item.id,
                order: origin_folders.get(index).order,
                updated: item.updated,
            }
        }).filter((item) => {
            const origin = origin_folders.find(o => o.id === item.id)
            return origin && origin.order !== item.order
        }).toJS()

        const data = {
            title: folder.title,
            sub_title: folder.sub_title,
            description: folder.description,
            group_id: group.id,
            dominant_color: folder.dominant_color,
            orders: orders,
            covers: [
                thumbnailToItem(folder.origin_cover),
                thumbnailToItem(folder.default_cover),
                thumbnailToItem(folder.mini_cover),
                thumbnailToItem(folder.micro_cover),
            ]
        }

        form.append("data", JSON.stringify(data))

        return axios.post(
            `${HOST}/api/curations/folder/`, form, MultipartConfig()
        )
    }

    updateFolder = (
        origin_folders,
        folders,
        folder,
        folder_index,
    ) => {
        const orders = folders.map((item, index) => {
            return {
                id: item.id,
                order: origin_folders.get(index).order,
                updated: item.updated
            }
        }).filter((item) => {
            const origin = origin_folders.find(o => o.id === item.id)
            return origin && origin.order !== item.order
        }).toJS()

        if (folder_index === null) {
            return axios.put(
                `${HOST}/api/curations/folder/`, orders, JSONConfig()
            )
        }

        const origin = origin_folders.find(item => item.id === folder.id)

        const origin_cover = folder.origin_cover
        const default_cover = folder.default_cover
        const mini_cover = folder.mini_cover
        const micro_cover = folder.micro_cover

        const form = new FormData()
        const data = {}

        if (folder.title !== origin.title) {
            data["title"] = folder.title
        }
        if (folder.sub_title !== origin.sub_title) {
            data["sub_title"] = folder.sub_title
        }
        if (folder.description !== origin.description) {
            data["description"] = folder.description
        }
        if (folder.dominant_color !== origin.dominant_color) {
            data["dominant_color"] = folder.dominant_color
        }
        if (orders.length > 0) {
            data["orders"] = orders
        }
        if (
            origin_cover.file !== null &&
            default_cover.file !== null &&
            mini_cover.file !== null &&
            micro_cover.file !== null
        ) {
            form.append("origin_cover", origin_cover.file, origin_cover.file.name)
            form.append("default_cover", default_cover.file, default_cover.file.name)
            form.append("mini_cover", mini_cover.file, mini_cover.file.name)
            form.append("micro_cover", micro_cover.file, micro_cover.file.name)

            data["covers"] = [
                thumbnailToItem(origin_cover),
                thumbnailToItem(default_cover),
                thumbnailToItem(mini_cover),
                thumbnailToItem(micro_cover),
            ]
        }

        form.append("data", JSON.stringify(data))
        return axios.put(
            `${HOST}/api/curations/folder/${folder.id}/`, form, MultipartConfig()
        )
    }

    deleteFolder = (folder_id) => {
        return axios.delete(
            `${HOST}/api/curations/folder/${folder_id}/`, JSONConfig()
        )
    }
}

export default new CurationAPI();