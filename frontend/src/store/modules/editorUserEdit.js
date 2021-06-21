import { createAction, handleActions } from "redux-actions"
import { Record, List } from "immutable";

const CHANGE_USERS_LOADING = "editorUserEdit/CHANGE_USERS_LOADING"
const CHANGE_EDIT_LOADING = "editorUserEdit/CHANGE_EDIT_LOADING"

const CHANGE_NICKNAME = "editorUserEdit/CHANGE_NICKNAME";
const CHANGE_CHECK_NICKNAME = "editorUserEdit/CHANGE_CHECK_NICKNAME"
const CHANGE_VISIBILITY = "editorUserEdit/CHANGE_VISIBILITY"

const LOAD_AVATAR = "editorUserEdit/LOAD_AVATAR"
const SET_AVATARS = "editorUserEdit/SET_AVATARS"
const CLEAR_AVATAR = "editorUserEdit/CLEAR_AVATAR"

const SET_USERS = "editorUserEdit/SET_USERS"
const REFRESH_USERS = "editorUserEdit/REFRESH_USERS"

const SELECT_USER = "editorUserEdit/SELECT_USER"

const CLEAR_FORM = "editorUserEdit/CLEAR_FORM"
const CLEAR_PAGE = "editorUserEdit/CLEAR_PAGE"

export const changeUsersLoading = createAction(CHANGE_USERS_LOADING)
export const changeEditLoading = createAction(CHANGE_EDIT_LOADING)

export const changeNickname = createAction(CHANGE_NICKNAME)
export const changeCheckNickname = createAction(CHANGE_CHECK_NICKNAME)
export const changeVisibility = createAction(CHANGE_VISIBILITY)

export const loadAvatar = createAction(LOAD_AVATAR)
export const setAvatars = createAction(SET_AVATARS)
export const clearAvatar = createAction(CLEAR_AVATAR)

export const setUsers = createAction(SET_USERS)
export const refreshUsers = createAction(REFRESH_USERS)

export const selectUser = createAction(SELECT_USER)

export const clearForm = createAction(CLEAR_FORM)
export const clearPage = createAction(CLEAR_PAGE)


const ImageRecord = Record({
    file: null,
    image_size_type: "",
    image_type: "",
    image: "",
    width: 0,
    height: 0,
    updated: new Date(),
})

const itemToImage = (item) => {
    if (!item || item === "") {
        return ImageRecord()
    }

    return ImageRecord({
        image_size_type: item.image_size_type,
        image_type: item.image_type,
        image: item.image,
        width: item.width,
        height: item.height,
        updated: item.updated,
    })
}

const createImage = (size_type, item = null) => {
    if (!item) {
        return ImageRecord({
            image_size_type: size_type
        })
    }
    return ImageRecord({
        file: item.file,
        image_size_type: size_type,
        image_type: item.type,
        image: item.url,
        width: item.width,
        height: item.height,
        updated: new Date(),
    })
}

const createOriginImage = (item = null) => createImage("origin", item)
const createDefaultImage = (item = null) => createImage("default", item)
const createMiniImage = (item = null) => createImage("mini", item)
const createMicroImage = (item = null) => createImage("micro", item)

const UserRecord = Record({
    id: "",
    nickname: "",
    nickname_status: "",
    nickname_message: "",
    email: "",
    origin_avatar: createOriginImage(),
    default_avatar: createDefaultImage(),
    mini_avatar: createMiniImage(),
    micro_avatar: createMicroImage(),
    is_visibility: false,
    updated: new Date(),
})

const SelectedRecord = Record({
    user_index: -1,
    user: UserRecord(),
})

const initialState = Record({
    edit_loading: false,
    users_loading: false,
    image_loaded: false,
    selected: SelectedRecord(),
    origin_users: List([]),
    users: List([]),
})();

const itemsToUsers = (items) => {
    return items.map(user => {
        return {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            grade: user.grade,
            order: user.order,
            is_verified: user.is_verified,
            is_usable_editor: user.is_usable_editor,
            is_visibility: user.is_visibility,
            upload_stop_period: user.upload_stop_period,
            origin_avatar: itemToImage(user.origin_avatar),
            default_avatar: itemToImage(user.default_avatar),
            mini_avatar: itemToImage(user.mini_avatar),
            micro_avatar: itemToImage(user.micro_avatar),
            updated: user.updated,
            created: user.created,
        }
    })
}

export default handleActions({
    [CHANGE_USERS_LOADING]: (state, { payload: loading }) => {
        return state.set("users_loading", loading)
    },
    [CHANGE_EDIT_LOADING]: (state, { payload: loading }) => {
        return state.set("edit_loading", loading)
    },
    [CHANGE_NICKNAME]: (state, { payload: nickname }) => {
        if (state.selected.user_index === null) {
            return state
        }
        return state.setIn(["selected", "user", "nickname"], nickname)
    },
    [CHANGE_CHECK_NICKNAME]: (state, { payload: { status, message = "" } }) => {
        return state.mergeIn(["selected", "user"], {
            nickname_status: status,
            nickname_message: message,
        })
    },
    [CHANGE_VISIBILITY]: (state, { payload: visibility }) => {
        return state.setIn(["selected", "user", "is_visibility"], visibility)
    },
    [LOAD_AVATAR]: (state, { payload: items }) => {
        if (items.length <= 0) {
            return state
        }

        return state.set("image_loaded", false)
            .mergeIn(["selected", "user"], {
                origin_avatar: createOriginImage(items[0]),
                default_avatar: createDefaultImage(),
                mini_avatar: createMiniImage(),
                micro_avatar: createMicroImage(),
            })
    },
    [SET_AVATARS]: (state, { payload: {
        defaultImage, miniImage, microImage
    } }) => {
        return state.set("image_loaded", true)
            .mergeIn(["selected", "user"], {
                default_avatar: createDefaultImage(defaultImage),
                mini_avatar: createMiniImage(miniImage),
                micro_avatar: createMicroImage(microImage),
            })
    },
    [CLEAR_AVATAR]: (state) => {
        return state.mergeIn(["selected", "user"], {
            origin_avatar: createOriginImage(),
            default_avatar: createDefaultImage(),
            mini_avatar: createMiniImage(),
            micro_avatar: createMicroImage(),
        })
    },
    [SET_USERS]: (state, { payload: items }) => {
        const origin_users = itemsToUsers(items)
        const users = itemsToUsers(items)

        return state.mergeIn(["selected"], {
            user: UserRecord(),
            user_index: -1,
        }).merge({
            origin_users: List(origin_users),
            users: List(users),
        })
    },
    [REFRESH_USERS]: (state, { payload: items }) => {
        const origin_users = itemsToUsers(items)
        const users = itemsToUsers(items)

        const selected_user = state.selected.user

        const user_index = users.findIndex(item => item.id === selected_user.id)
        return state.setIn(["selected", "user_index"], user_index)
            .merge({
                origin_users: List(origin_users),
                users: List(users),
            })
    },
    [SELECT_USER]: (state, { payload: user }) => {
        const index = state.users.findIndex(item => item.id === user.id)
        if (index === -1) {
            return state
        }

        return state.set("image_loaded", true)
            .mergeIn(["selected"], {
                user_index: index,
                user: UserRecord({ ...user })
            })
    },
    [CLEAR_FORM]: (state) => {
        return state.mergeIn(["selected"], SelectedRecord())
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            edit_loading: false,
            users_loading: false,
            image_loaded: false,
            selected: SelectedRecord(),
            origin_users: null,
            users: null,
        })
    },
}, initialState)