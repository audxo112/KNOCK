import { createAction, handleActions } from "redux-actions"
import { List, Record } from "immutable";

const CHANGE_THEMES_LOADING = "curationThemeEdit/CHANGE_THEMES_LOADING"
const CHANGE_GROUPS_LOADING = "curationThemeEdit/CHANGE_GROUPS_LOADING"
const CHANGE_FOLDERS_LOADING = "curationThemeEdit/CHANGE_FOLDERS_LOADING"
const CHANGE_EDIT_LOADING = "curationThemeEdit/CHANGE_EDIT_LOADING"

const CHANGE_SEARCH = "curationThemeEdit/CHANGE_SEARCH"
const CHANGE_CHECK_SEARCH = "curationThemeEdit/CHANGE_CHECK_SEARCH"
const SET_SEARCH_THEMES = "curationThemeEdit/SET_SEARCH_THEMES"

const SET_GROUPS = "curationThemeEdit/SET_GROUPS"
const SELECT_GROUP = "curationThemeEdit/SELECT_GROUP"
const SET_FOLDERS = "curationThemeEdit/SET_FOLDERS"
const SELECT_FOLDER = "curationThemeEdit/SELECT_FOLDER"
const SET_THEMES = "curationThemeEdit/SET_THEMES"
const SELECT_THEME = "curationThemeEdit/SELECT_THEME"
const UNSELECT_THEME = "curationThemeEdit/UNSELECT_THEME"

const CHANGE_THEME_ORDER = "curationThemeEdit/CHANGE_THEME_ORDER"

const CLEAR_PAGE = "curationThemeEdit/CLEAR_PAGE"

export const changeThemesLoading = createAction(CHANGE_THEMES_LOADING)
export const changeGroupsLoading = createAction(CHANGE_GROUPS_LOADING)
export const changeFoldersLoading = createAction(CHANGE_FOLDERS_LOADING)
export const changeEditLoading = createAction(CHANGE_EDIT_LOADING)
export const changeSearch = createAction(CHANGE_SEARCH)
export const changeCheckSearch = createAction(CHANGE_CHECK_SEARCH)
export const setSearchThemes = createAction(SET_SEARCH_THEMES)

export const setGroups = createAction(SET_GROUPS)
export const selectGroup = createAction(SELECT_GROUP)
export const setFolders = createAction(SET_FOLDERS)
export const selectFolder = createAction(SELECT_FOLDER)
export const setThemes = createAction(SET_THEMES)
export const selectTheme = createAction(SELECT_THEME)
export const unselectTheme = createAction(UNSELECT_THEME)

export const changeThemeOrder = createAction(CHANGE_THEME_ORDER)

export const clearPage = createAction(CLEAR_PAGE)

const SearchRecord = Record({
    value: "",
    status: "",
    themes: List([]),
})

const SelectedRecord = Record({
    group_id: "",
    group: null,
    folder_id: "",
    folder: null,
    theme_id: "",
    theme: null,
})

const initialState = Record({
    themes_loading: false,
    groups_loading: false,
    folders_loading: false,
    edit_loading: false,
    search: SearchRecord(),
    selected: SelectedRecord(),
    groups: List([]),
    folders: List([]),
    origin_themes: List([]),
    themes: List([]),
})();

export default handleActions({
    [CHANGE_THEMES_LOADING]: (state, { payload: loading }) => {
        return state.set("themes_loading", loading)
    },
    [CHANGE_GROUPS_LOADING]: (state, { payload: loading }) => {
        return state.set("groups_loading", loading)
    },
    [CHANGE_FOLDERS_LOADING]: (state, { payload: loading }) => {
        return state.set("folders_loading", loading)
    },
    [CHANGE_EDIT_LOADING]: (state, { payload: loading }) => {
        return state.set("eidt_loading", loading)
    },
    [CHANGE_SEARCH]: (state, { payload: search }) => {
        return state.setIn(["search", "value"], search)
    },
    [CHANGE_CHECK_SEARCH]: (state, { payload: status }) => {
        return state.setIn(["search", "status"], status)
    },
    [SET_SEARCH_THEMES]: (state, { payload: themes }) => {
        if (themes === "") return state.setIn(["search", "themes"], List([]))
        return state.setIn(["search", "themes"], List(themes))
    },
    [SET_GROUPS]: (state, { payload: groups }) => {
        if (groups === "") return state.set("groups", List([]))
        return state.set("groups", List(groups))
    },
    [SELECT_GROUP]: (state, { payload: group }) => {
        const group_id = group !== null ? group.id : ""
        return state.mergeIn(["selected"], {
            group_id: group_id,
            group: group,
            folder_id: "",
            folder: null,
            theme_id: "",
            theme: null,
        }).merge({
            search: SearchRecord(),
            folders: List([]),
            themes: List([]),
            origin_themes: List([]),
        })
    },
    [SET_FOLDERS]: (state, { payload: folders }) => {
        if (folders === "") return state.set("folders", List([]))
        return state.set("folders", List(folders))
    },
    [SELECT_FOLDER]: (state, { payload: folder }) => {
        const folder_id = folder !== null ? folder.id : ""
        return state.mergeIn(["selected"], {
            folder_id: folder_id,
            folder: folder,
            theme_id: "",
            theme: null,
        }).merge({
            search: SearchRecord(),
            themes: List([]),
            origin_themes: List([]),
        })
    },
    [SET_THEMES]: (state, { payload: themes }) => {
        if (themes === "") return state.merge({
            origin_themes: List([]),
            themes: List([]),
        })
        return state.merge({
            origin_themes: List(themes),
            themes: List(themes),
        })
    },
    [SELECT_THEME]: (state, { payload: theme }) => {
        const theme_id = theme !== null ? theme.theme_id : ""
        return state.mergeIn(["selected"], {
            theme_id: theme_id,
            theme: theme,
        })
    },
    [UNSELECT_THEME]: (state) => {
        return state.mergeIn(["selected"], {
            theme_id: "",
            theme: null,
        })
    },
    [CHANGE_THEME_ORDER]: (state, { payload: {
        src, dst
    } }) => {
        if (src === undefined || dst === undefined) return state

        const old = state.getIn(["themes", src])
        const themes = state.get("themes")
            .delete(src)
            .insert(dst, old)

        return state.set("themes", themes)
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            themes_loading: false,
            groups_loading: false,
            folders_loading: false,
            edit_loading: false,
            search: SearchRecord(),
            selected: SelectedRecord(),
            groups: List([]),
            folders: List([]),
            themes: List([]),
            origin_themes: List([]),
        })
    },
}, initialState)