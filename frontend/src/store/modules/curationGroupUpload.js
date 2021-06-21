import { createAction, handleActions } from "redux-actions"
import { List, Record } from "immutable";

const CHANGE_GROUPS_LOADING = "curationGroupUpload/CHANGE_GROUPS_LOADING";
const CHANGE_UPLOAD_LOADING = "curationGroupUpload/CHANGE_UPLOAD_LOADING";

const CHANGE_GROUP_ORDER = "curationGroupUpload/GHANGE_GROUP_ORDER";

const CHANGE_TITLE = "curationGroupUpload/CHANGE_TITLE";
const CHANGE_POST_START_DATE_TIME = "curationGroupUpload/CHANGE_POST_START_DATE_TIME";
const CHANGE_POST_END_DATE_TIME = "curationGroupUpload/CHANGE_POST_END_DATE_TIME";

const CHANGE_VIEW_TYPE = "curationGroupUpload/CHANGE_VIEW_TYPE";

const SET_GROUPS = "curationGroupUpload/SET_GROUPS";
const REFRESH_GROUPS = "curationGroupUpload/REFRESH_GROUPS"

const CLEAR_FORM = "curationGroupUpload/CLEAR_FORM";
const CLEAR_PAGE = "curationGroupUpload/CLEAR_PAGE";

export const changeGroupsLoading = createAction(CHANGE_GROUPS_LOADING)
export const changeUploadLoading = createAction(CHANGE_UPLOAD_LOADING)

export const changeGroupOrder = createAction(CHANGE_GROUP_ORDER)

export const changeTitle = createAction(CHANGE_TITLE)
export const changePostStartDateTime = createAction(CHANGE_POST_START_DATE_TIME)
export const changePostEndDateTime = createAction(CHANGE_POST_END_DATE_TIME)
export const changeViewType = createAction(CHANGE_VIEW_TYPE)

export const setGroups = createAction(SET_GROUPS)
export const refreshGroups = createAction(REFRESH_GROUPS)

export const clearForm = createAction(CLEAR_FORM)
export const clearPage = createAction(CLEAR_PAGE)

const dateToStr = (d, after = 0) => {
    const date = new Date(d.getTime())
    date.setFullYear(date.getFullYear() + after)
    return date.toISOString().slice(0, 10)
}

const GroupRecord = Record({
    id: "",
    title: "",
    post_start_datetime: dateToStr(new Date()),
    post_end_datetime: dateToStr(new Date(), 1),
    view_type: null,
    order: 0,
})

const initialState = Record({
    groups_loading: false,
    upload_loading: false,
    origin_groups: null,
    groups: null,
    group: GroupRecord(),
    current_index: 0,
})();

export default handleActions({
    [CHANGE_GROUPS_LOADING]: (state, { payload: loading }) => {
        return state.set("groups_loading", loading)
    },
    [CHANGE_UPLOAD_LOADING]: (state, { payload: loading }) => {
        return state.set("upload_loading", loading)
    },
    [CHANGE_GROUP_ORDER]: (state, { payload: { src, dst } }) => {
        if (state.groups === null)
            return state

        const old = state.getIn(["groups", src])
        const groups = state.get("groups")
            .delete(src)
            .insert(dst, old)

        const current_index = groups.findIndex(item => item.id === "")

        return state.set("current_index", current_index)
            .set("groups", groups)
    },
    [CHANGE_TITLE]: (state, { payload: title }) => {
        state = state.setIn(["group", "title"], title)
        if (state.groups === null) {
            return state
        }
        return state.update("groups", groups => groups.setIn(
            [state.current_index, "title"], title
        ))
    },
    [CHANGE_POST_START_DATE_TIME]: (state, { payload: startDate }) => {
        state = state.setIn(["group", "post_start_datetime"], startDate)
        if (state.groups === null) {
            return state
        }
        return state.update("groups", groups => groups.setIn(
            [state.current_index, "post_start_datetime"], startDate
        ))
    },
    [CHANGE_POST_END_DATE_TIME]: (state, { payload: endDate }) => {
        state = state.setIn(["group", "post_end_datetime"], endDate)
        if (state.groups === null) {
            return state
        }
        return state.update("groups", groups => groups.setIn(
            [state.current_index, "post_end_datetime"], endDate
        ))
    },
    [CHANGE_VIEW_TYPE]: (state, { payload: viewType }) => {
        state = state.setIn(["group", "view_type"], viewType)
        if (state.groups === null) {
            return state
        }
        return state.update("groups", groups => groups.setIn(
            [state.current_index, "view_type"], viewType
        ))
    },
    [SET_GROUPS]: (state, { payload: groups }) => {
        groups.unshift({
            ...state.group.toJS()
        })

        return state.merge({
            origin_groups: List(groups),
            groups: List(groups),
            current_index: 0,
        })
    },
    [REFRESH_GROUPS]: (state, { payload: groups }) => {
        groups.unshift({
            ...state.getIn(["groups", state.current_index])
        })

        return state.merge({
            origin_groups: List(groups),
            groups: List(groups),
            current_index: 0,
        })
    },
    [CLEAR_FORM]: (state) => {
        return state.merge({
            origin_groups: null,
            groups: null,
            group: GroupRecord(),
            current_index: null,
        })
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            groups_loading: false,
            upload_loading: false,
            origin_groups: null,
            groups: null,
            group: GroupRecord(),
            current_index: null,
        })
    },
}, initialState)