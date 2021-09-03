import { createAction, handleActions } from "redux-actions"
import { List, Record } from "immutable";

const CHANGE_USERS_LOADING = "themeUpload/CHANGE_USERS_LOADING"
const CHANGE_CURATIONS_LOADING = "themeUpload/CHANGE_CURATIONS_LOADING"
const CHANGE_UPLOAD_LOADING = "themeUpload/CHANGE_UPLOAD_LOADING"

const SET_USERS = "themeUpload/SET_USERS"
const SELECT_USER = "themeUpload/SELECT_USER"

const CHANGE_TITLE = "themeUpload/CHANGE_TITLE"
const CHANGE_LINK = "themeUpload/CHANGE_LINK"
const CHANGE_TAG = "themeUpload/CHANGE_TAG"
const CREATE_TAG = "themeUpload/CREATE_TAG"
const DELETE_TAG = "themeUpload/DELETE_TAG"

const SET_RECENT_LINKS = "themeUpload/SET_RECENT_LINKS"

const SET_CURATIONS = "themeUpload/SET_CURATIONS"
const SELECT_GROUP = "themeUpload/SELECT_GROUP"
const SELECT_FOLDER = "themeUpload/SELECT_FOLDER"

const CHANGE_POST_START = "themeUpload/CHANGE_POST_START"
const CHANGE_POST_END = "themeUpload/CHANGE_POST_END"

const CHANGE_ALLOW_DOWNLOAD = "themeUpload/CHANGE_ALLOW_DOWNLOAD"

const CHANGE_DOMINANT_COLOR = "themeUpload/CHANGE_DOMINANT_COLOR"
const LOAD_CONTENT = "themeUpload/LOAD_CONTENT"
const SET_LARGE_PRELOAD = "themeUpload/SET_LARGE_PRELOAD"
const SET_NORMAL_PRELOAD = "themeUpload/SET_NORMAL_PRELOAD"
const SET_THUMBNAIL = "themeUpload/SET_THUMBNAIL"
const CLEAR_THUMBNAIL = "themeUpload/CLEAR_THUMBNAIL"
const CLEAR_LARGE_CONTENT = "themeUpload/CLEAR_LARGE_CONTENT"
const CLEAR_NORMAL_CONTENT = "themeUpload/CLEAR_NORMAL_CONTENT"

const CLEAR_FORM = "themeUpload/CLEAR_FORM"
const CLEAR_PAGE = "themeUpload/CLEAR_PAGE"

export const changeUsersLoading = createAction(CHANGE_USERS_LOADING)
export const changeCurationsLoading = createAction(CHANGE_CURATIONS_LOADING)
export const changeUploadLoading = createAction(CHANGE_UPLOAD_LOADING)

export const setUsers = createAction(SET_USERS)
export const selectUser = createAction(SELECT_USER)

export const changeTitle = createAction(CHANGE_TITLE)
export const changeLink = createAction(CHANGE_LINK)
export const changeTag = createAction(CHANGE_TAG)
export const createTag = createAction(CREATE_TAG)
export const deleteTag = createAction(DELETE_TAG)

export const setRecentLinks = createAction(SET_RECENT_LINKS)

export const setCurations = createAction(SET_CURATIONS)
export const selectGroup = createAction(SELECT_GROUP)
export const selectFolder = createAction(SELECT_FOLDER)

export const changePostStart = createAction(CHANGE_POST_START)
export const changePostEnd = createAction(CHANGE_POST_END)

export const changeAllowDownload = createAction(CHANGE_ALLOW_DOWNLOAD)

export const changeDominantColor = createAction(CHANGE_DOMINANT_COLOR)
export const loadContent = createAction(LOAD_CONTENT)
export const setLargePreload = createAction(SET_LARGE_PRELOAD)
export const setNormalPreload = createAction(SET_NORMAL_PRELOAD)
export const setThumbnail = createAction(SET_THUMBNAIL)
export const clearThumbnail = createAction(CLEAR_THUMBNAIL)
export const clearLargeContent = createAction(CLEAR_LARGE_CONTENT)
export const clearNormalContent = createAction(CLEAR_NORMAL_CONTENT)

export const clearForm = createAction(CLEAR_FORM)
export const clearPage = createAction(CLEAR_PAGE)

const dateToStr = (d, after = 0) => {
    const date = new Date(d.getTime())
    date.setFullYear(date.getFullYear() + after)
    return date.toISOString().slice(0, 10)
}

const ImageRecord = Record({
    file: null,
    image_size_type: "",
    image_type: "",
    image: "",
    width: 0,
    height: 0,
})

const ContentRecord = Record({
    screen_size: "",
    preload_file: null,
    preload_type: "",
    preload: "",
    content_file: null,
    content_type: "",
    content: "",
    width: 0,
    height: 0,
})

let tag_id = 100000000;

const TagRecord = Record({
    id: tag_id++,
    tag: "",
})

const ThemeRecord = Record({
    user: null,
    title: "",
    tags: List([]),
    link: "",
    is_allow_download: true,
    group: null,
    folder: null,
    dominant_color: "#000000",
    post_start: dateToStr(new Date()),
    post_end: dateToStr(new Date(), 20),
    origin_thumbnail: ImageRecord(),
    default_thumbnail: ImageRecord(),
    mini_thumbnail: ImageRecord(),
    large_content: ContentRecord(),
    normal_content: ContentRecord(),
})

const initialState = Record({
    users_loading: false,
    upload_loading: false,
    users: List([]),
    tag: "",
    curations: List([]),
    recent_links: List([]),
    theme: ThemeRecord(),
})();

const itemsToUsers = (items) => {
    return items.map(user => {
        var avatar = null
        if (user.micro_avatar)
            avatar = ImageRecord(user.micro_avatar)
        else avatar = ImageRecord()
        return {
            id: user.id,
            nickname: user.nickname,
            micro_avatar: avatar,
            updated: user.updated,
        }
    })
}

const createResource = (size_type, item) => {
    return ImageRecord({
        file: item.file,
        image_size_type: size_type,
        image_type: item.type,
        image: item.url,
        width: item.width,
        height: item.height,
    })
}

const createContent = (size, content = null) => {
    if (!content)
        return ContentRecord({
            screen_size: size
        })

    return ContentRecord({
        screen_size: size,
        content_file: content.file,
        content_type: content.type,
        content: content.url,
        width: content.width,
        height: content.height
    })
}

const createLargeContent = (content = null) => createContent("large", content)

const createNormalContent = (content = null) => createContent("normal", content)

const getRatio = ({ width, height }) => {
    if (width === 0)
        return -1
    return height / width
}

export default handleActions({
    [CHANGE_USERS_LOADING]: (state, { payload: loading }) => {
        return state.set("users_loading", loading)
    },
    [CHANGE_CURATIONS_LOADING]: (state, { payload: loading }) => {
        return state.set("curations_loading", loading)
    },
    [CHANGE_UPLOAD_LOADING]: (state, { payload: loading }) => {
        return state.set("upload_loading", loading)
    },
    [SET_USERS]: (state, { payload: items }) => {
        const users = itemsToUsers(items)
        return state.set("users", List(users))
    },
    [SELECT_USER]: (state, { payload: user }) => {
        const index = state.users.findIndex(item => item.id === user.id)
        if (index === -1) {
            return state
        }
        return state.setIn(["theme", "user"], user)
    },
    [CHANGE_TITLE]: (state, { payload: title }) => {
        return state.setIn(["theme", "title"], title)
    },
    [CHANGE_LINK]: (state, { payload: link }) => {
        return state.setIn(["theme", "link"], link)
    },
    [CHANGE_TAG]: (state, { payload: tag }) => {
        return state.set("tag", tag)
    },
    [CREATE_TAG]: (state, { payload: tag }) => {
        const tags = tag.split(",")
            .map(tag => tag.trim().replaceAll(" ", "_"))
            .filter(tag => tag !== "" &&
                state.theme.tags.findIndex(
                    item => item.tag === tag
                ) === -1
            ).reduce((unique, item) =>
                unique.includes(item) ? unique : [...unique, item], []
            )
        if (tags.length === 0)
            return state

        const items = tags.map(tag => TagRecord({
            id: tag_id++, tag: tag
        }))
        return state.updateIn(["theme", "tags"], tags => tags.concat(items))
    },
    [DELETE_TAG]: (state, { payload: tag }) => {
        const index = state.theme.tags.findIndex(item => item.id === tag.id)
        return state.deleteIn(["theme", "tags", index])
    },
    [SET_RECENT_LINKS]: (state, { payload: recentLinks }) => {
        return state.set("recent_links", recentLinks)
    },
    [SET_CURATIONS]: (state, { payload: curations }) => {
        const emptyFolder = {
            id: "",
            title: "폴더 선택"
        }

        curations.unshift({
            id: "",
            title: "그룹 선택",
            folders: [],
        })

        curations.map(item => {
            item.folders.unshift(emptyFolder)
            return item
        })
        return state.set("curations", curations)
    },
    [SELECT_GROUP]: (state, { payload: group }) => {
        if (group.id === "") {
            return state.mergeIn(["theme"], {
                group: null,
                folder: null,
            })
        }
        return state.mergeIn(["theme"], {
            group: group,
            folder: null,
        })
    },
    [SELECT_FOLDER]: (state, { payload: folder }) => {
        if (folder.id === "") {
            return state.setIn(["theme", "folder"], null)
        }
        return state.setIn(["theme", "folder"], folder)
    },
    [CHANGE_POST_START]: (state, { payload: post_start }) => {
        return state.setIn(["theme", "post_start"], post_start)
    },
    [CHANGE_POST_END]: (state, { payload: post_end }) => {
        return state.setIn(["theme", "post_end"], post_end)
    },
    [CHANGE_ALLOW_DOWNLOAD]: (state, { payload: is_allow_download }) => {
        return state.setIn(["theme", "is_allow_download"], is_allow_download)
    },
    [CHANGE_DOMINANT_COLOR]: (state, { payload: color }) => {
        return state.setIn(["theme", "dominant_color"], color)
    },
    [LOAD_CONTENT]: (state, { payload: list }) => {
        if (!list || list.length === 0) return state

        var {
            large_content: large,
            normal_content: normal
        } = state.theme

        const base = list[0]
        const type = base.type

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
                if (large.content !== "" &&
                    content.type !== large.content_type) {
                    large = createLargeContent()
                }
                normal = createNormalContent(content)
            }
        }

        return state.mergeIn(["theme"], {
            large_content: large,
            normal_content: normal,
        })
    },
    [SET_LARGE_PRELOAD]: (state, { payload: {
        originImage, defaultImage, miniImage
    } }) => {
        return state.mergeIn(["theme", "large_content"], {
            preload_file: originImage.file,
            preload_type: originImage.type,
            preload: originImage.url,
        }).mergeIn(["theme"], {
            origin_thumbnail: createResource("origin", originImage),
            default_thumbnail: createResource("default", defaultImage),
            mini_thumbnail: createResource("mini", miniImage),
        })
    },
    [SET_NORMAL_PRELOAD]: (state, { payload: preload }) => {
        return state.mergeIn(["theme", "normal_content"], {
            preload_file: preload.file,
            preload_type: preload.type,
            preload: preload.url,
        })
    },
    [SET_THUMBNAIL]: (state, { payload: {
        originImage, defaultImage, miniImage
    } }) => {
        return state.mergeIn(["theme"], {
            origin_thumbnail: createResource("origin", originImage),
            default_thumbnail: createResource("default", defaultImage),
            mini_thumbnail: createResource("mini", miniImage),
        })
    },
    [CLEAR_THUMBNAIL]: (state) => {
        return state.mergeIn(["theme"], {
            origin_thumbnail: ImageRecord(),
            default_thumbnail: ImageRecord(),
            mini_thumbnail: ImageRecord(),
        })
    },
    [CLEAR_LARGE_CONTENT]: (state) => {
        return state.setIn(["theme", "large_content"], createLargeContent())
    },
    [CLEAR_NORMAL_CONTENT]: (state) => {
        return state.setIn(["theme", "normal_content"], createNormalContent())
    },
    [CLEAR_FORM]: (state) => {
        return state.merge({
            tag: ""
        }).mergeIn(["theme"], {
            title: "",
            tags: List([]),
            link: "",
            origin_thumbnail: ImageRecord(),
            default_thumbnail: ImageRecord(),
            mini_thumbnail: ImageRecord(),
            large_content: ContentRecord(),
            normal_content: ContentRecord(),
        })
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            users_loading: false,
            upload_loading: false,
            users: List([]),
            tag: "",
            curations: List([]),
            recent_links: List([]),
            theme: ThemeRecord(),
        })
    },
}, initialState)