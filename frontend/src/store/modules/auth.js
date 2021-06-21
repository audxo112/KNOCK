import {createAction, handleActions} from "redux-actions";
import {Record} from "immutable";

import { STATUS_NONE } from "const/auth"

const CHANGE_LOADING = "auth/CHANGE_LOADING"
const CHANGE_STATUS = "auth/CHANGE_STATUS"

export const changeLoading = createAction(CHANGE_LOADING)
export const changeStatus = createAction(CHANGE_STATUS)

const initialState = Record({
    loading:false,
    status:STATUS_NONE,
})();

export default handleActions({
    [CHANGE_LOADING] : (state, {payload:loading}) => {
        return state.set("loading", loading)
    },
    [CHANGE_STATUS] : (state, {payload:status}) => {
        return state.set("status", status)
    },
}, initialState)