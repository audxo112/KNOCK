import axios from "axios"
import { HOST, JSONConfig } from "./apiBase"


class ListAPI {
    getThemes = (
        group_id,
        folder_id = "",
        filter = "registered",
        search = "",
    ) => {
        return axios.get(
            `${HOST}/api/lists/themes/`, {
            params: {
                group_id: group_id,
                folder_id: folder_id,
                search: search,
                filter: filter,
            }
        }, JSONConfig()
        )
    }

    uploadThemeList = (
        group_id,
        folder_id,
        theme_id
    ) => {
        return axios.post(
            `${HOST}/api/lists/themes/`, {
            group_id: group_id,
            folder_id: folder_id,
            theme_id: theme_id,
        }, JSONConfig()
        )
    }

    updateThemeListOrder = (
        origin_themes,
        themes
    ) => {
        const orders = themes.map((item, index) => {
            return {
                id: item.id,
                order: origin_themes.get(index).order,
                updated: item.updated
            }
        }).filter((item) => {
            const origin = origin_themes.find(o => o.id === item.id)
            return origin !== undefined && item.order !== origin.order
        }).toJS()

        return axios.put(
            `${HOST}/api/lists/themes/`, orders, JSONConfig()
        )
    }

    deleteThemeList = (
        themeList_id,
    ) => {
        return axios.delete(
            `${HOST}/api/lists/themes/detail/${themeList_id}/`, JSONConfig(),
        )
    }

}

export default new ListAPI();