import { createAction, handleActions } from "redux-actions"
import { Record, List } from "immutable";
import { GROUP_LIST, OLD_GROUP_LIST } from "components/Curation";

const CHANGE_GROUPS_LOADING = "curationGroupEdit/CHANGE_GROUPS_LOADING"
const CHANGE_EDIT_LOADING = "curationGroupEdit/CHANGE_EDIT_LOADING"

const CHANGE_GROUP_ORDER = "curationGroupEdit/CHANGE_GROUP_ORDER";

const CHANGE_TITLE = "curationGroupEdit/CHANGE_TITLE";
const CHANGE_POST_START_DATE_TIME = "curationGroupEdit/CHANGE_POST_START_DATE_TIME"
const CHANGE_POST_END_DATE_TIME = "curationGroupEdit/CHANGE_POST_END_DATE_TIME"

const CHANGE_PAGE = "curationGroupEdit/CHANGE_PAGE";

const SET_GROUPS = "curationGroupEdit/SET_GROUPS";
const REFRESH_GROUPS = "curationGroupEdit/REFRESH_GROUPS";

const SELECT_GROUP = "curationGroupEdit/SELECT_GROUP";

const CLEAR_FORM = "curationGroupEdit/CLEAR_FORM"
const CLEAR_PAGE = "curationGroupEdit/CLEAR_PAGE"

export const changeGroupsLoading = createAction(CHANGE_GROUPS_LOADING)
export const changeEditLoading = createAction(CHANGE_EDIT_LOADING)

export const changeGroupOrder = createAction(CHANGE_GROUP_ORDER)

export const changeTitle = createAction(CHANGE_TITLE)
export const changePostStartDateTime = createAction(CHANGE_POST_START_DATE_TIME)
export const changePostEndDateTime = createAction(CHANGE_POST_END_DATE_TIME)

export const changePage = createAction(CHANGE_PAGE)

export const setGroups = createAction(SET_GROUPS)
export const refreshGroups = createAction(REFRESH_GROUPS)

export const selectGroup = createAction(SELECT_GROUP)

export const clearForm = createAction(CLEAR_FORM)
export const clearPage = createAction(CLEAR_PAGE)

const GroupRecord = Record({
    id: "",
    title: "",
    post_start_datetime: "",
    post_end_datetime: "",
    view_type: "",
    order: 0,
})

const SelectedRecord = Record({
    group_index: null,
    group: GroupRecord(),
})

const initialState = Record({
    edit_loading: false,
    groups_loading: false,
    selected: SelectedRecord(),
    origin_groups: null,
    groups: null,
    current_page: GROUP_LIST,
})();

export default handleActions({
    [CHANGE_EDIT_LOADING]: (state, { payload: loading }) => {
        return state.set("edit_loading", loading)
    },
    [CHANGE_GROUPS_LOADING]: (state, { payload: loading }) => {
        return state.set("groups_loading", loading)
    },
    [CHANGE_GROUP_ORDER]: (state, { payload: { src, dst } }) => {
        if (
            state.groups === null ||
            state.current_page === OLD_GROUP_LIST
        ) return state

        const old = state.getIn(["groups", src])
        const groups = state.get("groups")
            .delete(src)
            .insert(dst, old)

        if (state.selected.group_index === null)
            return state.set("groups", groups)

        const group = state.selected.group
        const index = groups.findIndex(item => item.id === group.id)

        return state.set("groups", groups)
            .setIn(["selected", "group_index"], index)
    },
    [CHANGE_TITLE]: (state, { payload: title }) => {
        if (state.selected.group_index === null)
            return state

        return state.setIn(["selected", "group", "title"], title)
            .update("groups", groups => groups.setIn(
                [state.selected.group_index, "title"], title
            ))
    },
    [CHANGE_POST_START_DATE_TIME]: (state, { payload: startDate }) => {
        if (state.selected.group_index === null)
            return state

        return state.setIn(["selected", "group", "post_start_datetime"], startDate)
            .update("groups", groups => groups.setIn(
                [state.selected.group_index, "post_start_datetime"], startDate
            ))
    },
    [CHANGE_POST_END_DATE_TIME]: (state, { payload: endDate }) => {
        if (state.selected.group_index === null)
            return state

        return state.setIn(["selected", "group", "post_end_datetime"], endDate)
            .update("groups", groups => groups.setIn(
                [state.selected.group_index, "post_end_datetime"], endDate
            ))
    },
    [CHANGE_PAGE]: (state, { payload: page }) => {
        switch (page) {
            case GROUP_LIST:
            case OLD_GROUP_LIST:
                return state.set("current_page", page)
            default:
                return state
        }
    },
    [SET_GROUPS]: (state, { payload: items }) => {
        return state.merge({
            selected: SelectedRecord(),
            origin_groups: List(items),
            groups: List(items),
        })
    },
    [REFRESH_GROUPS]: (state, { payload: items }) => {


        if (state.selected.group_index === null) {
            return state.merge({
                selected: SelectedRecord(),
                origin_groups: List(items),
                groups: List(items),
            })
        }

        const group = state.selected.group
        const groups = items.map(item => {
            if (group !== null && item.id === group.id) {
                return state.groups.get(state.selected.group_index)
            }
            return item
        })

        const origin_index = groups.findIndex(item => item.id === group.id)
        const group_index = origin_index !== -1 ? origin_index : null

        return state
            .merge({
                selected: SelectedRecord({
                    group: group,
                    group_index: group_index,
                }),
                origin_groups: List(items),
                groups: List(groups),
            })
    },
    [SELECT_GROUP]: (state, { payload: group }) => {
        if (state.selected.group !== null) {
            const origin_group = state.origin_groups.find(
                item => item.id === state.selected.group.id
            )

            state = state.setIn(["groups", state.selected.group_index], {
                ...origin_group
            })
        }

        const index = state.groups.findIndex(item => item.id === group.id)
        if (index !== -1) {
            return state.mergeIn(["selected"], {
                group: GroupRecord({ ...group }),
                group_index: index,
            })
        }
        return state
    },
    [CLEAR_FORM]: (state) => {
        return state.merge({
            selected: SelectedRecord(),
            origin_groups: null,
            groups: null,
            current_page: GROUP_LIST,
        })
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            groups_loading: false,
            edit_loading: false,
            selected: SelectedRecord(),
            origin_groups: null,
            groups: null,
            current_page: GROUP_LIST,
        })
    },
}, initialState)