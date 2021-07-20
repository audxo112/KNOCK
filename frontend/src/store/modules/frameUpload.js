import { createAction, handleActions } from "redux-actions";
import { List, Record } from "immutable";

const CHANGE_UPLOAD_LOADING = "frameUpload/CHANGE_UPLOAD_LOADING";
const CHANGE_PRIORITY_LOADING = "frameUpload/CHANGE_PRIORITY_LOADING";
const CHANGE_USERS_LOADING = "frameUpload/CHANGE_USERS_LOADING"

const SET_USERS = "frameUpload/SET_USERS"
const SELECT_USER = "frameUpload/SELECT_USER"

const CHANGE_TITLE = "frameUpload/CHANGE_TITLE";
const CHANGE_SCALE_TYPE = "frameUpload/CHANGE_SCALE_TYPE";
const CHANGE_REPEAT_MODE = "frameUpload/CHANGE_REPEAT_MODE";

const APPEND_MAX_PRIORITY = "frameUpload/APPEND_MAX_PRIORITY";
const SET_MAX_PRIORITY = "frameUpload/SET_MAX_PRIORITY";
const SELECT_PRIORITY = "frameUpload/SELECT_PRIORITY";

const CHANGE_DOMINANT_COLOR = "frameUpload/CHANGE_DOMINANT_COLOR"
const LOAD_CONTENT = "frameUpload/LOAD_CONTENT"
const CLEAR_NORMAL_CONTENT = "frameUpload/CLEAR_NORMAL_CONTENT"
const CLEAR_LARGE_CONTENT = "frameUpload/CLEAR_LARGE_CONTENT"
const SET_THUMBNAIL = "frameUpload/SET_THUMBNAIL"

const CLEAR_FORM = "frameUpload/CLEAR_FORM";
const CLEAR_PAGE = "frameUpload/CLEAR_PAGE";

export const changeUploadLoading = createAction(CHANGE_UPLOAD_LOADING);
export const changePriorityLoading = createAction(CHANGE_PRIORITY_LOADING);
export const changeUsersLoading = createAction(CHANGE_USERS_LOADING)

export const setUsers = createAction(SET_USERS)
export const selectUser = createAction(SELECT_USER)

export const changeTitle = createAction(CHANGE_TITLE)
export const changeScaleType = createAction(CHANGE_SCALE_TYPE)
export const changeRepeatMode = createAction(CHANGE_REPEAT_MODE)

export const appendMaxPriority = createAction(APPEND_MAX_PRIORITY)
export const setMaxPriority = createAction(SET_MAX_PRIORITY)
export const selectPriority = createAction(SELECT_PRIORITY)

export const changeDominantColor = createAction(CHANGE_DOMINANT_COLOR)
export const loadContent = createAction(LOAD_CONTENT);
export const clearNormalContent = createAction(CLEAR_NORMAL_CONTENT);
export const clearLargeContent = createAction(CLEAR_LARGE_CONTENT)
export const setThumbnail = createAction(SET_THUMBNAIL);

export const clearForm = createAction(CLEAR_FORM);
export const clearPage = createAction(CLEAR_PAGE);

const ImageRecord = Record({
    file: null,
    image_size_type: "",
    image_type: "",
    image: "",
    width: 0,
    height: 0,
})

const createImage = (size_type, item = null) => {
    if (!item)
        return ImageRecord({
            image_size_type: size_type
        })

    return ImageRecord({
        file: item.file,
        image_size_type: size_type,
        image_type: item.type,
        image: item.url,
        width: item.width,
        height: item.height,
    })
}

const createOriginThumbnail = (thumbnail = null) => createImage("origin", thumbnail)

const createDefaultThumbnail = (thumbnail = null) => createImage("default", thumbnail)

const createMiniThumbnail = (thumbnail = null) => createImage("mini", thumbnail)

const ContentRecord = Record({
    screen_size: "",
    content_file: null,
    content_type: "",
    content: "",
    width: 0,
    height: 0,
})

const createContent = (screen_size, content = null) => {
    if (!content)
        return ContentRecord({
            screen_size: screen_size
        })

    return ContentRecord({
        screen_size: screen_size,
        content_file: content.file,
        content_type: content.type,
        content: content.url,
        width: content.width,
        height: content.height
    })
}

const createLargeContent = (content = null) => createContent("large", content)

const createNormalContent = (content = null) => createContent("normal", content)

const itemsToUsers = (items) => {
    return items.map(user => {
        var avatar = null
        if (user.micro_avatar) avatar = ImageRecord(user.micro_avatar)
        else avatar = ImageRecord()
        return {
            id: user.id,
            nickname: user.nickname,
            micro_avatar: avatar,
            updated: user.updated
        }
    })
}

const FrameRecord = Record({
    user: null,
    title: "",
    priority: null,
    scale_type: null,
    repeat_mode: null,
    origin_thumbnail: createOriginThumbnail(),
    default_thumbnail: createDefaultThumbnail(),
    mini_thumbnail: createMiniThumbnail(),
    normal_content: createNormalContent(),
    large_content: createLargeContent(),
})

const initialState = Record({
    upload_loading: false,
    priority_loading: false,
    users_loading: false,
    max_priority: 0,
    frame: FrameRecord(),
    users: List([]),
})();

const getRatio = ({ width, height }) => {
    if (width === 0)
        return -1
    return height / width
}

export default handleActions({
    [CHANGE_UPLOAD_LOADING]: (state, { payload: loading }) => {
        return state.set("upload_loading", loading)
    },
    [CHANGE_PRIORITY_LOADING]: (state, { payload: loading }) => {
        return state.set("priority_loading", loading)
    },
    [CHANGE_USERS_LOADING]: (state, { payload: loading }) => {
        return state.set("users_loading", loading)
    },
    [SET_USERS]: (state, { payload: items }) => {
        const users = itemsToUsers(items)
        return state.set("users", List(users))
    },
    [SELECT_USER]: (state, { payload: user }) => {
        const index = state.users.findIndex(item => item.id === user.id)
        if (index === -1) return state

        return state.setIn(["frame", "user"], user)
    },
    [CHANGE_TITLE]: (state, { payload: title }) => {
        return state.setIn(["frame", "title"], title)
    },
    [CHANGE_SCALE_TYPE]: (state, { payload: scale_type }) => {
        return state.setIn(["frame", "scale_type"], scale_type)
    },
    [CHANGE_REPEAT_MODE]: (state, { payload: repeat_mode }) => {
        return state.setIn(["frame", "repeat_mode"], repeat_mode)
    },
    [SELECT_PRIORITY]: (state, { payload: priority }) => {
        return state.setIn(["frame", "priority"], priority)
    },
    [APPEND_MAX_PRIORITY]: (state) => {
        return state.set("max_priority", state.max_priority + 1)
    },
    [SET_MAX_PRIORITY]: (state, { payload: max_priority }) => {
        if (max_priority <= 0)
            return state

        return state.set("max_priority", max_priority)
            .setIn(["frame", "priority"], 1)
    },
    [CHANGE_DOMINANT_COLOR]: (state, { payload: color }) => {
        return state.setIn(["frame", "dominant_color"], color)
    },
    [LOAD_CONTENT]: (state, { payload: list }) => {
        if (!list || list.length === 0) return state

        var {
            normal_content: normal,
            large_content: large,
        } = state.frame

        const type = list[0].type

        for (const content of list) {
            if (type !== content.type) continue

            const cr = getRatio(content)
            if (cr > 1.91) {
                if (normal.content !== "" &&
                    content.type !== normal.content_type) {
                    normal = createNormalContent()
                }
                large = createLargeContent(content)
            }
            else {
                if (large.content !== "" &
                    content.type !== large.content_type) {
                    large = createLargeContent()
                }
                normal = createNormalContent(content)
            }
        }

        return state.mergeIn(["frame"], {
            normal_content: normal,
            large_content: large,
        })
    },
    [CLEAR_NORMAL_CONTENT]: (state) => {
        if (state.frame.large_content.file === null) {
            return state.mergeIn(["frame"], {
                origin_thumbnail: createOriginThumbnail(),
                default_thumbnail: createDefaultThumbnail(),
                mini_thumbnail: createMiniThumbnail(),
                normal_content: createNormalContent(),
            })
        }

        return state.setIn(["frame", "normal_content"], createNormalContent())
    },
    [CLEAR_LARGE_CONTENT]: (state) => {
        if (state.frame.normal_content.file === null) {
            return state.mergeIn(["frame"], {
                origin_thumbnail: createOriginThumbnail(),
                default_thumbnail: createDefaultThumbnail(),
                mini_thumbnail: createMiniThumbnail(),
                large_content: createLargeContent(),
            })
        }
        return state.setIn(["frame", "large_content"], createLargeContent())
    },
    [SET_THUMBNAIL]: (state, { payload: {
        originImage, defaultImage, miniImage
    } }) => {
        return state.mergeIn(["frame"], {
            origin_thumbnail: createOriginThumbnail(originImage),
            default_thumbnail: createDefaultThumbnail(defaultImage),
            mini_thumbnail: createMiniThumbnail(miniImage),
        })
    },
    [CLEAR_FORM]: (state) => {
        return state.mergeIn(["frame"], {
            title: "",
            scale_type: null,
            repeat_mode: null,
            origin_thumbnail: createOriginThumbnail(),
            default_thumbnail: createDefaultThumbnail(),
            mini_thumbnail: createMiniThumbnail(),
            normal_content: createNormalContent(),
            large_content: createLargeContent(),
        })
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            upload_loading: false,
            priority_loading: false,
            max_priority: 0,
            frame: FrameRecord(),
        })
    }
}, initialState)