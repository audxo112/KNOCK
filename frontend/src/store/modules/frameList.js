import { createAction, handleActions } from "redux-actions";
import { List, Record } from "immutable";
import { PAGE_FRAME_LIST } from "const/page"

const CHANGE_PRIORITY_LOADING = "frameList/CHANGE_PRIORITY_LOADING";
const CHANGE_USERS_LOADING = "frameList/CHANGE_USERS_LOADING";
const CHANGE_FRAMES_LOADING = "frameList/CHANGE_FRAMES_LOADING";
const CHANGE_EDIT_LOADING = "frameList/CHANGE_EDIT_LOADING";

const CHANGE_PAGE = "frameList/CHANGE_PAGE";

const SET_USERS = "frameList/SET_USERS";
const SELECT_USER = "frameList/SELECT_USER";

const CHANGE_TITLE = "frameList/CHANGE_TITLE";
const CHANGE_FRAME_PRIORITY = "frameList/CHANGE_FRAME_PRIORITY";
const CHANGE_SCALE_TYPE = "frameList/CHANGE_SCALE_TYPE";
const CHANGE_REPEAT_MODE = "frameList/CHANGE_REPEAT_MODE";

const APPEND_MAX_PRIORITY = "frameList/APPEND_MAX_PRIORITY";
const SET_MAX_PRIORITY = "frameList/SET_MAX_PRIORITY";
const SELECT_PRIORITY = "frameList/SELECT_PRIORITY";
const CHANGE_PRIORITY = "frameList/CHANGE_PRIORITY"

const CHANGE_FRAME_ORDER = "frameList/CHANGE_FRAME_ORDER";
const UPDATE_FRAME_ORDERS = "framesList/UPDATE_FRAME_ORDERS"
const SET_FRAMES = "frameList/SET_FRAMES";
const REFRESH_FRAMES = "frameList/REFRESH_FRAMES"
const SELECT_FRAME = "frameList/SELECT_FRAME";
const UNSELECT_FRAME = "frameList/UNSELECT_FRAME";
const UPDATE_FRAME = "frameList/UPDATE_FRAME";

const APPEND_FRAMES = "frameList/APPEND_FRAMES";
const DELETE_FRAME = "frameList/DELETE_FRAME";

const CHANGE_DOMINANT_COLOR = "frameList/CHANGE_DOMINANT_COLOR";
const LOAD_CONTENT = "frameList/LOAD_CONTENT";
const CLEAR_NORMAL_CONTENT = "frameList/CLEAR_NORMAL_CONTENT"
const CLEAR_LARGE_CONTENT = "frameList/CLEAR_LARGE_CONTENT"
const SET_THUMBNAIL = "frameList/SET_THUMBNAIL";
const CLEAR_THUMBNAIL = "frameList/CLEAR_THUMBNAIL"

const CLEAR_PAGE = "frameList/CLEAR_PAGE";

export const changePriorityLoading = createAction(CHANGE_PRIORITY_LOADING)
export const changeUsersLoading = createAction(CHANGE_USERS_LOADING)
export const changeFramesLoading = createAction(CHANGE_FRAMES_LOADING)
export const changeEditLoading = createAction(CHANGE_EDIT_LOADING)

export const changePage = createAction(CHANGE_PAGE)

export const setUsers = createAction(SET_USERS)
export const selectUser = createAction(SELECT_USER)

export const changeTitle = createAction(CHANGE_TITLE)
export const changeFramePriority = createAction(CHANGE_FRAME_PRIORITY)
export const changeScaleType = createAction(CHANGE_SCALE_TYPE)
export const changeRepeatMode = createAction(CHANGE_REPEAT_MODE)

export const appendMaxPriority = createAction(APPEND_MAX_PRIORITY)
export const setMaxPriority = createAction(SET_MAX_PRIORITY)
export const selectPriority = createAction(SELECT_PRIORITY)
export const changePriority = createAction(CHANGE_PRIORITY)

export const changeFrameOrder = createAction(CHANGE_FRAME_ORDER)
export const updateFrameOrders = createAction(UPDATE_FRAME_ORDERS)
export const setFrames = createAction(SET_FRAMES)
export const appendFrames = createAction(APPEND_FRAMES)
export const refreshFrames = createAction(REFRESH_FRAMES)
export const selectFrame = createAction(SELECT_FRAME)
export const unselectFrame = createAction(UNSELECT_FRAME)
export const updateFrame = createAction(UPDATE_FRAME)
export const deleteFrame = createAction(DELETE_FRAME)

export const changeDominantColor = createAction(CHANGE_DOMINANT_COLOR)
export const loadContent = createAction(LOAD_CONTENT);
export const clearNormalContent = createAction(CLEAR_NORMAL_CONTENT);
export const clearLargeContent = createAction(CLEAR_LARGE_CONTENT)
export const setThumbnail = createAction(SET_THUMBNAIL);
export const clearThumbnail = createAction(CLEAR_THUMBNAIL);

export const clearPage = createAction(CLEAR_PAGE);

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
    if (!item || item === "") return ImageRecord()

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
    if (!item) return ImageRecord({
        image_size_type: size_type
    })

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

const ContentRecord = Record({
    file: null,
    screen_size: "",
    content_type: "",
    content: "",
    width: 0,
    height: 0,
    updated: new Date(),
})

const itemToContent = (item) => {
    if (!item || item === "") return ContentRecord()

    return ContentRecord({
        screen_size: item.screen_size,
        content_type: item.content_type,
        content: item.content,
        width: item.width,
        height: item.height,
        updated: item.updated,
    })
}

const createContent = (screen_size, item = null) => {
    if (!item) return ContentRecord({
        screen_size: screen_size
    })

    return ContentRecord({
        file: item.file,
        screen_size: screen_size,
        content_type: item.type,
        content: item.url,
        width: item.width,
        height: item.height,
        updated: new Date(),
    })
}

const createLargeContent = (item = null) => createContent("large", item)
const createNormalContent = (item = null) => createContent("normal", item)

const FrameRecored = Record({
    id: "",
    user: null,
    title: "",
    dominant_color: "#000000",
    priority: null,
    scale_type: null,
    repeat_mode: null,
    origin_thumbnail: createOriginImage(),
    default_thumbnail: createDefaultImage(),
    mini_thumbnail: createMiniImage(),
    large_content: createLargeContent(),
    normal_content: createNormalContent(),
})

const SelectedRecord = Record({
    priority: null,
    frame_index: null,
    origin: null,
    frame: FrameRecored(),
})

const initialState = Record({
    priority_loading: false,
    users_loading: false,
    frames_loading: false,
    edit_loading: false,
    normal_image_loaded: false,
    large_image_loaded: false,
    page: PAGE_FRAME_LIST,
    selected: SelectedRecord(),
    origin_frames: List([]),
    frames: List([]),
    users: List([]),
    max_priority: 0,
})();

const itemToFrame = (frame) => {
    return {
        id: frame.id,
        order: frame.order,
        priority: frame.priority,
        title: frame.title,
        dominant_color: frame.dominant_color,
        scale_type: frame.scale_type,
        repeat_mode: frame.repeat_mode,
        content_type: frame.content_type,
        user: itemToUser(frame.owner),
        origin_thumbnail: itemToImage(frame.origin_thumbnail),
        default_thumbnail: itemToImage(frame.default_thumbnail),
        mini_thumbnail: itemToImage(frame.mini_thumbnail),
        normal_content: itemToContent(frame.normal_content),
        large_content: itemToContent(frame.large_content),
        updated: frame.updated,
    }
}

const itemsToFrames = (items) => {
    return items.map(frame => {
        return itemToFrame(frame)
    })
}

const itemToUser = (item) => {
    var avatar = null
    if (item.micro_avatar) avatar = ImageRecord(item.micro_avatar)
    else avatar = ImageRecord()
    return {
        id: item.id,
        nickname: item.nickname,
        micro_avatar: avatar,
        updated: item.updated
    }
}

const itemsToUsers = (items) => {
    return items.map(user => itemToUser(user))
}

const getRatio = ({ width, height }) => {
    if (width === 0)
        return -1
    return height / width
}

export default handleActions({
    [CHANGE_PRIORITY_LOADING]: (state, { payload }) => {
        return state.set("priority_loading", payload)
    },
    [CHANGE_USERS_LOADING]: (state, { payload }) => {
        return state.set("users_loading", payload)
    },
    [CHANGE_FRAMES_LOADING]: (state, { payload }) => {
        return state.set("frames_loading", payload)
    },
    [CHANGE_EDIT_LOADING]: (state, { payload }) => {
        return state.set("edit_loading", payload)
    },
    [CHANGE_PAGE]: (state, { payload: page }) => {
        if (page === PAGE_FRAME_LIST) {
            state = state.mergeIn(["selected"], {
                origin: null,
                frame: FrameRecored(),
            })
        }
        return state.set("page", page)
    },
    [SET_USERS]: (state, { payload: items }) => {
        const users = itemsToUsers(items)
        return state.set("users", List(users))
    },
    [SELECT_USER]: (state, { payload: user }) => {
        const index = state.users.findIndex(item => item.id === user.id)
        if (index === -1) return state

        return state.setIn(["selected", "frame", "user"], user)
    },
    [CHANGE_TITLE]: (state, { payload: title }) => {
        if (state.selected.frame_index === null) return state

        return state.setIn(["selected", "frame", "title"], title)
    },
    [CHANGE_FRAME_PRIORITY]: (state, { payload: priority }) => {
        if (state.selected.frame_index === null) return state

        return state.setIn(["selected", "frame", "priority"], priority)
    },
    [CHANGE_SCALE_TYPE]: (state, { payload: scale_type }) => {
        if (state.selected.frame_index === null) return state

        return state.setIn(["selected", "frame", "scale_type"], scale_type)
    },
    [CHANGE_REPEAT_MODE]: (state, { payload: repeat_mode }) => {
        if (state.selected.frame_index === null) return state

        return state.setIn(["selected", "frame", "repeat_mode"], repeat_mode)
    },
    [APPEND_MAX_PRIORITY]: (state) => {
        return state.set("max_priority", state.max_priority + 1)
    },
    [SET_MAX_PRIORITY]: (state, { payload: max_priority }) => {
        var priority = max_priority > 0 ? 1 : null

        return state.setIn(["selected", "priority"], priority)
            .set("max_priority", max_priority)
    },
    [SELECT_PRIORITY]: (state, { payload: priority }) => {
        return state.merge({
            page: PAGE_FRAME_LIST,
            selected: SelectedRecord({
                priority: priority
            }),
            origin_frames: List([]),
            frames: List([]),
        })
    },
    [CHANGE_PRIORITY]: (state, { payload: priority }) => {
        return state.setIn(["selected", "priority"], priority)
    },
    [CHANGE_FRAME_ORDER]: (state, { payload: {
        src, dst
    } }) => {
        if (src === undefined || dst === undefined) return state

        const old = state.getIn(["frames", src])
        const frames = state.get("frames")
            .delete(src)
            .insert(dst, old)

        const frame = state.selected.origin
        if (frame !== null) {
            const index = frames.findIndex(item => item.id === frame.id)
            state = state.setIn(["selected", "frame_index"], index)
        }
        return state.set("frames", frames)
    },
    [UPDATE_FRAME_ORDERS]: (state) => {
        return state.set("origin_frames", List(state.frames.toJS()))
    },
    [SET_FRAMES]: (state, { payload: items }) => {
        const frames = itemsToFrames(items)

        return state.mergeIn(["selected"], {
            frame_index: null,
            origin: null,
            frame: FrameRecored(),
        }).merge({
            origin_frames: List(frames),
            frames: List(frames)
        })
    },
    [APPEND_FRAMES]: (state, { payload: items }) => {
        const new_frames = itemsToFrames(items)

        const old_origin = state.origin_frames
        const old_frames = state.frames
        const origin = old_origin.concat(new_frames)
        const frames = old_frames.concat(new_frames)

        return state.merge({
            origin_frames: origin,
            frames: frames,
        })
    },
    [REFRESH_FRAMES]: (state, { payload: items }) => {
        const frames = itemsToFrames(items)

        return state.merge({
            origin_frames: List(frames),
            frames: List(frames)
        })
    },
    [SELECT_FRAME]: (state, { payload: frame }) => {
        const index = state.frames.findIndex(item => item.id === frame.id)
        if (index === -1) return state

        return state.merge({
            normal_image_loaded: frame.normal_content === "",
            large_image_loaded: frame.large_content === "",
        }).mergeIn(["selected"], {
            frame_index: index,
            origin: FrameRecored({ ...frame }),
            frame: FrameRecored({ ...frame })
        })
    },
    [UPDATE_FRAME]: (state, { payload: item }) => {
        const frame = itemToFrame(item)
        return state.mergeIn(["selected"], {
            priority: frame.priority,
            origin: FrameRecored({ ...frame }),
            frame: FrameRecored({ ...frame })
        })
    },
    [DELETE_FRAME]: (state, { payload: frame }) => {
        const origin_frames = state.origin_frames.filter(item => item.id !== frame.id)
        const frames = state.frames.filter(item => item.id !== frame.id)

        const origin = state.selected.origin
        if (origin !== null && origin.id === frame.id) {
            state = state.set("selected", SelectedRecord())
        }

        return state.merge({
            page: PAGE_FRAME_LIST,
            origin_frames: origin_frames,
            frames: frames,
        })
    },
    [UNSELECT_FRAME]: (state) => {
        return state.merge({
            normal_image_loaded: false,
            large_image_loaded: false,
        }).mergeIn(["selected"], {
            frame_index: null,
            origin: null,
            frame: FrameRecored()
        })
    },
    [CHANGE_DOMINANT_COLOR]: (state, { payload: color }) => {
        return state.setIn(["selected", "frame", "dominant_color"], color)
    },
    [LOAD_CONTENT]: (state, { payload: list }) => {
        if (!list || list.length === 0) return state

        var {
            normal_content: normal,
            large_content: large
        } = state.selected.frame

        const type = list[0].type
        var normal_image_loaded = state.normal_image_loaded
        var large_image_loaded = state.large_image_loaded

        for (const content of list) {
            if (type !== content.type) continue

            const cr = getRatio(content)
            if (cr > 1.91) {
                if (normal.content !== "" &&
                    content.type !== normal.content_type) {
                    normal = createNormalContent()
                }
                large = createLargeContent(content)
                large_image_loaded = false
            }
            else {
                if (large.content !== "" &
                    content.type !== large.content_type) {
                    large = createLargeContent()
                }
                normal = createNormalContent(content)
                normal_image_loaded = false
            }
        }

        if (type.indexOf("gif") === -1) {
            state = state.setIn(["selected", "frame", "repeat_mode"], "none")
        }

        return state.merge({
            normal_image_loaded: normal_image_loaded,
            large_image_loaded: large_image_loaded,
        }).mergeIn(["selected", "frame"], {
            normal_content: normal,
            large_content: large,
        })
    },
    [CLEAR_NORMAL_CONTENT]: (state) => {
        if (state.selected.frame.large_content.image === null) {
            return state.mergeIn(["selected", "frame"], {
                origin_thumbnail: createOriginImage(),
                default_thumbnail: createDefaultImage(),
                mini_thumbnail: createMiniImage(),
                normal_content: createNormalContent(),
            })
        }

        return state.setIn(["selected", "frame", "normal_content"], createNormalContent())
    },
    [CLEAR_LARGE_CONTENT]: (state) => {
        if (state.selected.frame.normal_content.image === null) {
            return state.mergeIn(["selected", "frame"], {
                origin_thumbnail: createOriginImage(),
                default_thumbnail: createDefaultImage(),
                mini_thumbnail: createMiniImage(),
                large_content: createLargeContent(),
            })
        }
        return state.setIn(["selected", "frame", "large_content"], createLargeContent())
    },
    [SET_THUMBNAIL]: (state, { payload: {
        originImage, defaultImage, miniImage
    } }) => {
        return state.merge({
            normal_image_loaded: true,
            large_image_loaded: true,
        }).mergeIn(["selected", "frame"], {
            origin_thumbnail: createOriginImage(originImage),
            default_thumbnail: createDefaultImage(defaultImage),
            mini_thumbnail: createMiniImage(miniImage),
        })
    },
    [CLEAR_THUMBNAIL]: (state) => {
        return state.mergeIn(["selected", "frame"], {
            origin_thumbnail: createOriginImage(),
            default_thumbnail: createDefaultImage(),
            mini_thumbnail: createMiniImage(),
        })
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            priority_loading: false,
            users_loading: false,
            frames_loading: false,
            edit_loading: false,
            init_normal_frame: false,
            init_large_frame: false,
            page: PAGE_FRAME_LIST,
            selected: SelectedRecord(),
            origin_frames: List([]),
            frames: List([]),
            users: List([]),
            max_priority: 0,
        })
    }
}, initialState)