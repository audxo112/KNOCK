import { createAction, handleActions } from "redux-actions"
import { Record } from "immutable";
import { FILTER_REGISTERED } from "components/Theme/ThemeOrderList"

const CHANGE_THEMES_LOADING = "curationThemeUpload/CHANGE_THEMES_LOADING"
const CHANGE_GROUPS_LOADING = "curationThemeUpload/CHANGE_GROUPS_LOADING"
const CHANGE_FOLDERS_LOADING = "curationThemeUpload/CHANGE_FOLDERS_LOADING"
const CHANGE_UPLOAD_LOADING = "curationThemeUpload/CHANGE_UPLOAD_LOADING"

const CHANGE_SEARCH = "curationThemeUpload/CHANGE_SEARCH"
const CHANGE_CHECK_SEARCH = "curationThemeUpload/CHANGE_CHECK_SEARCH"
const SET_SEARCH_THEMES = "curationThemeUpload/SET_SEARCH_THEMES"

const CHANGE_FILTER = "curationThemeUpload/CHANGE_FILTER"

const SET_GROUPS = "curationThemeUpload/SET_GROUPS"
const SELECT_GROUP = "curationThemeUpload/SELECT_GROUP"
const SET_FOLDERS = "curationThemeUpload/SET_FOLDERS"
const SELECT_FOLDER = "curationThemeUpload/SELECT_FOLDER"
const SET_THEMES = "curationThemeUpload/SET_THEMES"
const SELECT_THEME = "curationThemeUpload/SELECT_THEME"
const UNSELECT_THEME = "curationThemeUpload/UNSELECT_THEME"

const CLEAR_PAGE = "curationThemeUpload/CLEAR_PAGE"

export const changeThemesLoading = createAction(CHANGE_THEMES_LOADING)
export const changeGroupsLoading = createAction(CHANGE_GROUPS_LOADING)
export const changeFoldersLoading = createAction(CHANGE_FOLDERS_LOADING)
export const changeUploadLoading = createAction(CHANGE_UPLOAD_LOADING)
export const changeSearch = createAction(CHANGE_SEARCH)
export const changeCheckSearch = createAction(CHANGE_CHECK_SEARCH)
export const setSearchThemes = createAction(SET_SEARCH_THEMES)
export const changeFilter = createAction(CHANGE_FILTER)
export const setGroups = createAction(SET_GROUPS)
export const selectGroup = createAction(SELECT_GROUP)
export const setFolders = createAction(SET_FOLDERS)
export const selectFolder = createAction(SELECT_FOLDER)
export const setThemes = createAction(SET_THEMES)
export const selectTheme = createAction(SELECT_THEME)
export const unselectTheme = createAction(UNSELECT_THEME)
export const clearPage = createAction(CLEAR_PAGE)

const SearchRecord = Record({
    value: "",
    status: "",
    themes: [],
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
    upload_loading: false,
    search: SearchRecord(),
    selected: SelectedRecord(),
    filter: FILTER_REGISTERED,
    groups: [],
    folders: [],
    themes: [],
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
    [CHANGE_UPLOAD_LOADING]: (state, { payload: loading }) => {
        return state.set("upload_loading", loading)
    },
    [CHANGE_SEARCH]: (state, { payload: search }) => {
        return state.setIn(["search", "value"], search)
    },
    [CHANGE_CHECK_SEARCH]: (state, { payload: status }) => {
        return state.setIn(["search", "status"], status)
    },
    [SET_SEARCH_THEMES]: (state, { payload: themes }) => {
        if (themes === "") return state.setIn(["search", "themes"], [])
        return state.setIn(["search", "themes"], themes)
    },
    [CHANGE_FILTER]: (state, { payload: filter }) => {
        return state.set("filter", filter)
    },
    [SET_GROUPS]: (state, { payload: groups }) => {
        if (groups === "") return state.set("groups", [])
        return state.set("groups", groups)
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
            filter: FILTER_REGISTERED,
            search: SearchRecord(),
            folders: [],
            themes: [],
        })
    },
    [SET_FOLDERS]: (state, { payload: folders }) => {
        if (folders === "") return state.set("folders", [])
        return state.set("folders", folders)
    },
    [SELECT_FOLDER]: (state, { payload: folder }) => {
        const folder_id = folder !== null ? folder.id : ""
        return state.mergeIn(["selected"], {
            folder_id: folder_id,
            folder: folder,
            theme_id: "",
            theme: null,
        }).merge({
            filter: FILTER_REGISTERED,
            search: SearchRecord(),
            themes: [],
        })
    },
    [SET_THEMES]: (state, { payload: themes }) => {
        if (themes === "") return state.set("themes", [])
        return state.set("themes", themes)
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
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            themes_loading: false,
            groups_loading: false,
            folders_loading: false,
            upload_loading: false,
            search: SearchRecord(),
            selected: SelectedRecord(),
            filter: FILTER_REGISTERED,
            groups: [],
            folders: [],
            themes: [],
        })
    },
}, initialState)