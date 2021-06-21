import { createAction, handleActions } from "redux-actions"
import { Record, List, Map } from "immutable";
import { PAGE_THEME_LIST, PAGE_THEME_DETAIL } from "const/page"

const CHANGE_THEMES_LOADING = "themeList/CHANGE_THEMES_LOADING"
const CHANGE_USERS_LOADING = "themeList/CHANGE_USERS_LOADING"
const CHANGE_CURATIONS_LOADING = "themeList/CHANGE_CURATIONS_LOADING"
const CHANGE_RECENT_LINKS_LOADING = "themeList/CHANGE_RECENT_LINKS_LOADING"
const CHANGE_EDIT_LOADING = "themeList/CHANGE_EDIT_LOADING"

const CHANGE_LOADED_NORMAL_CONTENT = "themeList/CHANGE_LOADED_NORMAL_CONTENT"
const CHANGE_LOADED_LARGE_CONTENT = "themeList/CHANGE_LOADED_LARGE_CONTENT"

const CHANGE_PAGE = "themeList/CHANGE_PAGE"
const CHANGE_SHOW_SEARCH = "themeList/CHANGE_SHOW_SEARCH"
const CHANGE_SEARCH = "themeList/CHANGE_SEARCH"

const SET_THEMES = "themeList/SET_THEMES"
const APPEND_THEMES = "themeList/APPEND_THEMES"
const SELECT_THEME = "themeList/SELECT_THEME"
const UPDATE_THEME = "themeList/UPDATE_THEME"
const DELETE_THEME = "themeList/DELETE_THEME"

const SET_USERS = "themeList/SET_USERS"
const SELECT_USER = "themeList/SELECT_USER"

const CHANGE_TITLE = "themeList/CHANGE_TITLE"
const CHANGE_TAG = "themeList/CHANGE_TAG"
const CREATE_TAG = "themeList/CREATE_TAG"
const DELETE_TAG = "themeList/DELETE_TAG"
const CHANGE_LINK = "themeList/CHANGE_LINK"

const SET_RECENT_LINKS = "themeList/SET_RECENT_LINKS"

const CHANGE_POST_START = "themeList/CHANGE_POST_START"
const CHANGE_POST_END = "themeList/CHANGE_POST_END"

const LOAD_CONTENT = "themeList/LOAD_CONTENT"
const SET_LARGE_PRELOAD = "themeList/SET_LARGE_PRELOAD"
const SET_NORMAL_PRELOAD = "themeList/SET_NORMAL_PRELOAD"
const SET_THUMBNAIL = "themeList/SET_THUMBNAIL"
const CLEAR_THUMBNAIL = "themeList/CLEAR_THUMBNAIL"
const CLEAR_LARGE_CONTENT = "themeList/CLEAR_LARGE_CONTENT"
const CLEAR_NORMAL_CONTENT = "themeList/CLEAR_NORMAL_CONTENT"

const CLEAR_PAGE = "themeList/CLEAR_PAGE"

export const changeThemesLoading = createAction(CHANGE_THEMES_LOADING)
export const changeUsersLoading = createAction(CHANGE_USERS_LOADING)
export const changeCurationsLoading = createAction(CHANGE_CURATIONS_LOADING)
export const changeRecentLinksLoading = createAction(CHANGE_RECENT_LINKS_LOADING)
export const changeEditLoading = createAction(CHANGE_EDIT_LOADING)

export const changeLoadedNormalContent = createAction(CHANGE_LOADED_NORMAL_CONTENT)
export const changeLoadedLargeContent = createAction(CHANGE_LOADED_LARGE_CONTENT)

export const changePage = createAction(CHANGE_PAGE)
export const changeShowSearch = createAction(CHANGE_SHOW_SEARCH)
export const changeSearch = createAction(CHANGE_SEARCH)

export const setThemes = createAction(SET_THEMES)
export const appendThemes = createAction(APPEND_THEMES)
export const selectTheme = createAction(SELECT_THEME)
export const updateTheme = createAction(UPDATE_THEME)
export const deleteTheme = createAction(DELETE_THEME)

export const setUsers = createAction(SET_USERS)
export const selectUser = createAction(SELECT_USER)

export const changeTitle = createAction(CHANGE_TITLE)
export const changeLink = createAction(CHANGE_LINK)
export const changeTag = createAction(CHANGE_TAG)
export const createTag = createAction(CREATE_TAG)
export const deleteTag = createAction(DELETE_TAG)

export const setRecentLinks = createAction(SET_RECENT_LINKS)

export const changePostStart = createAction(CHANGE_POST_START)
export const changePostEnd = createAction(CHANGE_POST_END)

export const loadContent = createAction(LOAD_CONTENT)
export const setLargePreload = createAction(SET_LARGE_PRELOAD)
export const setNormalPreload = createAction(SET_NORMAL_PRELOAD)
export const setThumbnail = createAction(SET_THUMBNAIL)
export const clearThumbnail = createAction(CLEAR_THUMBNAIL)
export const clearLargeContent = createAction(CLEAR_LARGE_CONTENT)
export const clearNormalContent = createAction(CLEAR_NORMAL_CONTENT)

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
    updated: new Date(),
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
    updated: new Date(),
})

let tag_id = 100000000;

const TagRecord = Record({
    id: tag_id++,
    tag: "",
})

const ThemeRecord = Record({
    id: "",
    user: null,
    title: "",
    tags: List([]),
    link: "",
    post_start: dateToStr(new Date()),
    post_end: dateToStr(new Date(), 20),
    origin_thumbnail: ImageRecord(),
    default_thumbnail: ImageRecord(),
    mini_thumbnail: ImageRecord(),
    large_content: ContentRecord(),
    normal_content: ContentRecord(),
})

const initialState = Record({
    themes_loading: false,
    users_loading: false,
    curations_loading: false,
    recent_links_loading: false,
    edit_loading: false,
    loaded_large_content: false,
    loaded_normal_content: false,
    page: PAGE_THEME_LIST,
    show_search: false,
    theme_search: "",
    theme_headers: List([]),
    origin_themes: Map(),
    themes: Map(),
    users: List([]),
    tag: "",
    recent_links: List([]),
    origin: null,
    theme: ThemeRecord(),
})();

const itemToUser = (item) => {
    var avatar = null
    if (item.micro_avatar)
        avatar = ImageRecord(item.micro_avatar)
    else avatar = ImageRecord()
    return {
        id: item.id,
        nickname: item.nickname,
        micro_avatar: avatar,
        updated: item.updated,
    }
}

const itemsToUsers = (items) => {
    return items.map(user => {
        return itemToUser(user)
    })
}

const itemsToTags = (items) => {
    const tags = items.map(tag => TagRecord({
        id: tag.id,
        tag: tag.tag
    }))
    return List(tags)
}

const itemToThumbnail = (item) => {
    return ImageRecord({
        file: null,
        image_size_type: item.image_size_type,
        image_type: item.image_type,
        image: item.image,
        width: item.width,
        height: item.height,
        updated: item.updated,
    })
}

const itemToContent = (item) => {
    return ContentRecord({
        screen_size: item.screen_size,
        preload_file: null,
        preload_type: item.preload_type,
        preload: item.preload,
        content_file: null,
        content_type: item.content_type,
        content: item.content,
        width: item.width,
        height: item.height,
        updated: item.updated,
    })
}

const itemToTheme = (theme) => {
    return ThemeRecord({
        id: theme.id,
        user: itemToUser(theme.owner),
        title: theme.title,
        tags: itemsToTags(theme.tags),
        link: theme.link,
        post_start: theme.post_start_datetime,
        post_end: theme.post_end_datetime,
        origin_thumbnail: itemToThumbnail(theme.origin_thumbnail),
        default_thumbnail: itemToThumbnail(theme.default_thumbnail),
        mini_thumbnail: itemToThumbnail(theme.mini_thumbnail),
        large_content: itemToContent(theme.large_content),
        normal_content: itemToContent(theme.normal_content),
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

const filterTheme = (themes, filter) => {
    return themes.map((list, _) => list.filter(item =>
        item.title.indexOf(filter) !== -1
    )).filter((list, _) => list.size > 0)
}

export default handleActions({
    [CHANGE_THEMES_LOADING]: (state, { payload: loading }) => {
        return state.set("themes_loading", loading)
    },
    [CHANGE_USERS_LOADING]: (state, { payload: loading }) => {
        return state.set("users_loading", loading)
    },
    [CHANGE_CURATIONS_LOADING]: (state, { payload: loading }) => {
        return state.set("curations_loading", loading)
    },
    [CHANGE_RECENT_LINKS_LOADING]: (state, { payload: loading }) => {
        return state.set("recent_links_loading", loading)
    },
    [CHANGE_EDIT_LOADING]: (state, { payload: loading }) => {
        return state.set("edit_loading", loading)
    },
    [CHANGE_LOADED_NORMAL_CONTENT]: (state, { payload: loaded }) => {
        return state.set("loaded_normal_content", loaded)
    },
    [CHANGE_LOADED_LARGE_CONTENT]: (state, { payload: loaded }) => {
        return state.set("loaded_large_content", loaded)
    },
    [CHANGE_PAGE]: (state, { payload: page }) => {
        if (page === PAGE_THEME_LIST) {
            state = state.merge({
                origin: null,
                theme: ThemeRecord(),
            })
        }
        return state.merge({
            tag: "",
            page: page
        })
    },
    [CHANGE_SHOW_SEARCH]: (state, { payload: show_search }) => {
        if (show_search)
            return state.set("show_search", true)
        else {
            if (state.theme_search !== "") {
                const items = filterTheme(state.origin_themes, "")
                const headers = [...items.keys()].reverse()
                return state.merge({
                    show_search: false,
                    theme_search: "",
                    theme_headers: headers,
                    themes: items,
                })
            }

            return state.merge({
                show_search: false,
                theme_search: "",
            })
        }
    },
    [CHANGE_SEARCH]: (state, { payload: search }) => {
        const items = filterTheme(state.origin_themes, search)
        const headers = [...items.keys()].reverse()
        return state.merge({
            theme_search: search,
            theme_headers: headers,
            themes: items,
        })
    },
    [SET_THEMES]: (state, { payload: themes }) => {
        var origin = Map()
        themes.forEach(item => {
            const key = item.created.substring(0, 10)
            if (origin.has(key))
                origin = origin.update(key, list => list.push(item))
            else
                origin = origin.set(key, List([item]))
        })

        origin.keySeq().forEach(k => {
            origin = origin.update(k, list => list.sort((a, b) => {
                return a.created < b.created ? 1 : a.created > b.created ? -1 : 0
            }))
        })

        var items = filterTheme(origin, state.theme_search)

        const headers = [...items.keys()].reverse()
        return state.merge({
            theme_headers: headers,
            origin_themes: origin,
            themes: items,
        })

    },
    [APPEND_THEMES]: (state, { payload: themes }) => {
        var origin = state.origin_themes
        themes.forEach(item => {
            const key = item.created.substring(0, 10)
            if (origin.has(key))
                origin = origin.update(key, list => list.push(item))
            else
                origin = origin.set(key, List([item]))
        })

        origin.keySeq().forEach(k => {
            origin = origin.update(k, list => list.sort((a, b) => {
                return a.created < b.created ? 1 : a.created > b.created ? -1 : 0
            }))
        })

        var items = filterTheme(origin, state.theme_search)

        const headers = [...items.keys()]
        return state.merge({
            theme_headers: headers,
            origin_themes: origin,
            themes: items,
        })
    },
    [SELECT_THEME]: (state, { payload: theme }) => {
        return state.merge({
            loaded_large_content: theme.large_content === "",
            loaded_normal_content: theme.normal_content === "",
            tag: "",
            page: PAGE_THEME_DETAIL,
            origin: itemToTheme(theme),
            theme: itemToTheme(theme),
        })
    },
    [UPDATE_THEME]: (state, { payload: theme }) => {
        const key = theme.created.substring(0, 10)
        const origin_themes = state.origin_themes.update(key, list => {
            const index = list.findIndex(item => item.id === theme.id)
            return list.mergeIn([index], theme)
        }).filter((value) => {
            return value.size !== 0
        })

        const themes = state.themes.update(key, list => {
            const index = list.findIndex(item => item.id === theme.id)
            return list.mergeIn([index], theme)
        }).filter((value) => {
            return value.size !== 0
        })

        return state.merge({
            loaded_large_content: theme.large_content === "",
            loaded_normal_content: theme.normal_content === "",
            origin_themes: origin_themes,
            themes: themes,
            origin: itemToTheme(theme),
            theme: itemToTheme(theme),
        })
    },
    [DELETE_THEME]: (state, { payload: theme }) => {
        const key = theme.created.substring(0, 10)
        const origin_themes = state.origin_themes.update(key, list => {
            return list.filter(item => item.id !== theme.id)
        }).filter((value) => {
            return value.size !== 0
        })

        const themes = state.themes.update(key, list => {
            return list.filter(item => item.id !== theme.id)
        }).filter((value) => {
            return value.size !== 0
        })

        return state.merge({
            tag: "",
            page: PAGE_THEME_LIST,
            origin_themes: origin_themes,
            themes: themes,
            origin: null,
            theme: ThemeRecord(),
        })
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
    [CHANGE_LINK]: (state, { payload: link }) => {
        return state.setIn(["theme", "link"], link)
    },
    [SET_RECENT_LINKS]: (state, { payload: recentLinks }) => {
        return state.set("recent_links", recentLinks)
    },
    [CHANGE_POST_START]: (state, { payload: post_start }) => {
        return state.setIn(["theme", "post_start"], post_start)
    },
    [CHANGE_POST_END]: (state, { payload: post_end }) => {
        return state.setIn(["theme", "post_end"], post_end)
    },
    [LOAD_CONTENT]: (state, { payload: list }) => {
        if (!list || list.length === 0)
            return state

        var {
            large_content: large,
            normal_content: normal
        } = state.theme

        const base = list[0]
        const type = base.type

        for (const content of list) {
            if (type !== base.type)
                continue

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
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            themes_loading: false,
            users_loading: false,
            curations_loading: false,
            recent_links_loading: false,
            edit_loading: false,
            loaded_large_content: false,
            loaded_normal_content: false,
            page: PAGE_THEME_LIST,
            theme_search: "",
            theme_headers: List([]),
            origin_themes: Map(),
            themes: Map(),
            users: List([]),
            tag: "",
            curations: List([]),
            recent_links: List([]),
            origin: null,
            theme: ThemeRecord(),
        })
    },
}, initialState)