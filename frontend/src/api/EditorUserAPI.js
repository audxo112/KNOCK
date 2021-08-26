import axios from "axios"
import { HOST, JSONConfig, MultipartConfig, thumbnailToItem } from "./apiBase"


class EditorUserAPI {
    getUsers = (
    ) => {
        return axios.get(
            `${HOST}/api/users/editor`, JSONConfig()
        )
    }

    checkNickname = (
        nickname
    ) => {
        return axios.get(
            `${HOST}/api/users/nickname/check/${nickname}`, JSONConfig()
        )
    }

    registerUser = (
        user,
    ) => {
        const origin_avatar = user.origin_avatar
        const default_avatar = user.default_avatar
        const mini_avatar = user.mini_avatar
        const micro_avatar = user.micro_avatar

        const form = new FormData()
        form.append("origin_avatar", origin_avatar.file, origin_avatar.file.name)
        form.append("default_avatar", default_avatar.file, default_avatar.file.name)
        form.append("mini_avatar", mini_avatar.file, mini_avatar.file.name)
        form.append("micro_avatar", micro_avatar.file, micro_avatar.file.name)

        const data = {
            nickname: user.nickname,
            dominant_color: user.dominant_color,
            avatars: [
                thumbnailToItem(user.origin_avatar),
                thumbnailToItem(user.default_avatar),
                thumbnailToItem(user.mini_avatar),
                thumbnailToItem(user.micro_avatar),
            ]
        }

        form.append("data", JSON.stringify(data))

        return axios.post(
            `${HOST}/api/users/editor`, form, MultipartConfig()
        )
    }

    updateUser = (
        origin,
        user,
    ) => {
        const origin_avatar = user.origin_avatar
        const default_avatar = user.default_avatar
        const mini_avatar = user.mini_avatar
        const micro_avatar = user.micro_avatar

        const form = new FormData()
        const data = {}

        if (user.nickname !== origin.nickname) {
            data["nickname"] = user.nickname
        }

        console.log(user.dominant_color, origin.dominant_color)

        if (user.dominant_color !== origin.dominant_color) {
            data["dominant_color"] = user.dominant_color
        }

        if (user.is_visibility !== origin.is_visibility) {
            data["is_visibility"] = user.is_visibility
        }

        if (
            origin_avatar.file !== null &&
            default_avatar.file !== null &&
            mini_avatar.file !== null &&
            micro_avatar.file !== null
        ) {
            form.append("origin_avatar", origin_avatar.file, origin_avatar.file.name)
            form.append("default_avatar", default_avatar.file, default_avatar.file.name)
            form.append("mini_avatar", mini_avatar.file, mini_avatar.file.name)
            form.append("micro_avatar", micro_avatar.file, micro_avatar.file.name)

            data["avatars"] = [
                thumbnailToItem(origin_avatar),
                thumbnailToItem(default_avatar),
                thumbnailToItem(mini_avatar),
                thumbnailToItem(micro_avatar),
            ]
        }

        form.append("data", JSON.stringify(data))
        return axios.put(
            `${HOST}/api/users/edit/detail/${user.id}`, form, MultipartConfig()
        )
    }

    registerEditor = (
        user_id,
        allow,
    ) => {
        const form = new FormData()
        const data = {
            is_usable_editor: allow
        }
        form.append("data", JSON.stringify(data))


        return axios.put(
            `${HOST}/api/users/edit/detail/${user_id}`, form, MultipartConfig()
        )
    }

    searchUser = (
        value
    ) => {
        return axios.get(
            `${HOST}/api/users/search/name-email/${value}`, JSONConfig()
        )
    }

    getBanNicknames = (
    ) => {
        return axios.get(
            `${HOST}/api/users/nickname/ban`, JSONConfig()
        )
    }

    checkBanNickname = (
        nicknames
    ) => {
        const bans = nicknames.split(",")
            .map(nickname => nickname.trim().replaceAll(" ", "_"))
            .filter(nickname => nickname !== "")
            .reduce((unique, item) =>
                unique.includes(item) ? unique : [...unique, item], []
            )

        return axios.post(
            `${HOST}/api/users/nickname/ban/check`, bans, JSONConfig()
        )
    }

    uploadBanNickname = (
        nicknames
    ) => {
        const bans = nicknames.split(",")
            .map(nickname => {
                return {
                    nickname: nickname.trim().replaceAll(" ", "_")
                }
            })
            .filter(item => item.nickname !== "")
            .reduce((unique, item) =>
                unique.find(element => element.nickname === item.nickname) ?
                    unique : [...unique, item], []
            )

        return axios.post(
            `${HOST}/api/users/nickname/ban`, bans, JSONConfig()
        )
    }

    deleteBanNickname = (
        id
    ) => {
        return axios.delete(
            `${HOST}/api/users/nickname/ban/delete/${id}`, JSONConfig()
        )
    }
}

export default new EditorUserAPI()