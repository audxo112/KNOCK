import { createAction, handleActions } from "redux-actions"
import { Record, List } from "immutable";

const CHANGE_USERS_LOADING = "editorUserRegister/CHANGE_USERS_LOADING"
const CHANGE_SEARCH_LOADING = "editorUserRegister/CHANGE_SEARCH_LOADING"
const CHANGE_UPLOAD_LOADING = "editorUserRegister/CHANGE_UPLOAD_LOADING"
const SET_REGISTERING_ID = "editorUserRegister/SET_REGISTERING_ID"

const CHANGE_NICKNAME = "editorUserRegister/CHANGE_NICKNAME";
const CHANGE_CHECK_NICKNAME = "editorUserRegister/CHANGE_CHECK_NICKNAME";

const SET_USERS = "editorUserRegister/SET_USERS";

const LOAD_AVATAR = "editorUserRegister/LOAD_AVATAR";
const SET_AVATARS = "editorUserRegister/SET_AVATARS";
const CLEAR_AVATAR = "editorUserRegister/CLEAR_AVATAR";

const CHANGE_SEARCH_VALUE = "editorUserRegister/CHANGE_SEARCH_VALUE";
const SET_SEARCH_USERS = "editorUserRegister/SET_SEARCH_USERS";

const CLEAR_FORM = "editorUserRegister/CLEAR_FORM";
const CLEAR_PAGE = "editorUserRegister/CLEAR_PAGE";

export const changeUsersLoading = createAction(CHANGE_USERS_LOADING)
export const changeSearchLoading = createAction(CHANGE_SEARCH_LOADING)
export const changeUploadLoading = createAction(CHANGE_UPLOAD_LOADING)
export const setRegisteringId = createAction(SET_REGISTERING_ID)

export const changeNickname = createAction(CHANGE_NICKNAME)
export const changeCheckNickname = createAction(CHANGE_CHECK_NICKNAME)

export const setUsers = createAction(SET_USERS)

export const loadAvatar = createAction(LOAD_AVATAR)
export const setAvatars = createAction(SET_AVATARS)
export const clearAvatar = createAction(CLEAR_AVATAR)

export const changeSearchValue = createAction(CHANGE_SEARCH_VALUE)
export const setSearchUsers = createAction(SET_SEARCH_USERS)

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
        updated: item.updated,
    })
}

const createOriginImage = (item = null) => createImage("origin", item)
const createDefaultImage = (item = null) => createImage("default", item)
const createMiniImage = (item = null) => createImage("mini", item)
const createMicroImage = (item = null) => createImage("micro", item)

const SerachRecord = Record({
    value: "",
    users: List([]),
})

const UserRecord = Record({
    nickname: "",
    nickname_status: "",
    nickname_message: "",
    origin_avatar: createOriginImage(),
    default_avatar: createDefaultImage(),
    mini_avatar: createMiniImage(),
    micro_avatar: createMicroImage(),
})

const initialState = Record({
    users_loading: false,
    search_loading: false,
    upload_loading: false,
    registering_id: "",
    image_loaded: false,
    users: List([]),
    user: UserRecord(),
    search: SerachRecord(),
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
    [CHANGE_SEARCH_LOADING]: (state, { payload: loading }) => {
        return state.set("search_loading", loading)
    },
    [CHANGE_UPLOAD_LOADING]: (state, { payload: loading }) => {
        return state.set("upload_loading", loading)
    },
    [SET_REGISTERING_ID]: (state, { payload: id }) => {
        return state.set("registering_id", id)
    },
    [CHANGE_NICKNAME]: (state, { payload: nickname }) => {
        return state.setIn(["user", "nickname"], nickname)
    },
    [CHANGE_CHECK_NICKNAME]: (state, { payload: { status, message = "" } }) => {
        return state.mergeIn(["user"], {
            nickname_status: status,
            nickname_message: message,
        })
    },
    [LOAD_AVATAR]: (state, { payload: items }) => {
        if (items.length <= 0) {
            return state
        }

        return state.set("image_loaded", false)
            .mergeIn(["user"], {
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
            .mergeIn(["user"], {
                default_avatar: createDefaultImage(defaultImage),
                mini_avatar: createMiniImage(miniImage),
                micro_avatar: createMicroImage(microImage),
            })
    },
    [CLEAR_AVATAR]: (state) => {
        return state.mergeIn(["user"], {
            origin_avatar: createOriginImage(),
            default_avatar: createDefaultImage(),
            mini_avatar: createMiniImage(),
            micro_avatar: createMicroImage(),
        })
    },
    [CHANGE_SEARCH_VALUE]: (state, { payload: value }) => {
        return state.setIn(["search", "value"], value)
    },
    [SET_SEARCH_USERS]: (state, { payload: items }) => {
        const users = itemsToUsers(items)
        return state.setIn(["search", "users"], List(users))
    },
    [SET_USERS]: (state, { payload: items }) => {
        const users = itemsToUsers(items)
        return state.set("users", List(users))
    },
    [CLEAR_FORM]: (state) => {
        return state.merge({
            image_loaded: false,
            search: SerachRecord(),
            user: UserRecord(),
        })
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            users_loading: false,
            search_loading: false,
            upload_loading: false,
            image_loaded: false,
            users: List([]),
            user: UserRecord(),
            search: SerachRecord(),
        })
    },
}, initialState)