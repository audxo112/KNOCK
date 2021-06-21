import { createAction, handleActions } from "redux-actions";
import { Record } from "immutable";
import { DEBUG } from "const/core";

const SHOW = "popup/SHOW";
const DISMISS = "popup/DISMISS";

const SHOW_MESSAGE = "popup/SHOW_MESSAGE"
const SHOW_RESPONSE_ERROR = "popup/SHOW_RESPONSE_ERROR"

export const show = createAction(SHOW)
export const dismiss = createAction(DISMISS)

export const showMessage = createAction(SHOW_MESSAGE)
export const showResponseError = createAction(SHOW_RESPONSE_ERROR)

const PopupRecord = Record({
    isOpen: false,
    canceledOnTouchOutside: true,
    oneBtn: true,
    content: "",
    confirmText: "확인",
    confirmData: null,
    onConfirm: (data) => {
        if (DEBUG)
            console.log("onConfirm is not implements", data)
    },
    cancelText: "취소",
    onCancel: () => {
        if (DEBUG)
            console.log("onCancel is not implementes")
    },
})

const initialState = PopupRecord();

export default handleActions({
    [SHOW]: (_, { payload }) => {
        const newPopup = PopupRecord({
            isOpen: true,
            ...payload
        })
        return newPopup
    },
    [SHOW_MESSAGE]: (_, { payload: message }) => {
        const newPopup = PopupRecord({
            isOpen: true,
            content: message,
        })
        return newPopup
    },
    [SHOW_RESPONSE_ERROR]: (state, { payload: error }) => {
        if (!error.response) {
            if (DEBUG)
                console.log(error)
            return state
        }
        const r = error.response
        const newPopup = PopupRecord({
            isOpen: true
        })
        if (!r)
            return newPopup.set("content", "서버와 연결을 실패 했습니다.")
        else if (r.status === 400)
            return newPopup.set("content", "잘못된 요청입니다.")
        else if (r.status === 500)
            return newPopup.set("content", "서버 내부에서 문제가 일어났습니다.")

        return state
    },
    [DISMISS]: (state) => {
        return state.set("isOpen", false)
    }
}, initialState)