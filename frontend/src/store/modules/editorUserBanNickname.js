import { createAction, handleActions } from "redux-actions"
import { List, Record, Map } from "immutable";

const CHANGE_BAN_NICKNAMES_LOADING = "editorUserBanNickname/CHANGE_BAN_NICKNAMES_LOADING";
const CHANGE_UPLOAD_LOADING = "editorUserBanNickname/CHANGE_UPLOAD_LOADING"
const SET_DELETING_ID = "editorUserBanNickname/SET_DELETING_ID"

const CHANGE_BAN_NICKNAME = "editorUserBanNickname/CHANGE_BAN_NICKNAME"
const CHANGE_CHECK_BAN_NICKNAME = "editorUserBanNickname/CHANGE_CHECK_NICKNAME"

const CHANGE_BAN_NICKNAME_FILTER = "editorUserBanNickname/CHANGE_BAN_NICKNAME_FILTER"

const SET_BAN_NICKNAMES = "editorUserBanNickname/SET_BAN_NICKNAMES"

const CLEAR_FORM = "editorUserBanNickname/CLEAR_FORM"
const CLEAR_PAGE = "editorUserBanNickname/CLEAR_PAGE"

export const changeBanNicknamesLoading = createAction(CHANGE_BAN_NICKNAMES_LOADING)
export const changeUploadLoading = createAction(CHANGE_UPLOAD_LOADING)
export const setDeletingId = createAction(SET_DELETING_ID)

export const changeBanNickname = createAction(CHANGE_BAN_NICKNAME)
export const changeCheckBanNickname = createAction(CHANGE_CHECK_BAN_NICKNAME)

export const changeBanNicknameFilter = createAction(CHANGE_BAN_NICKNAME_FILTER)

export const setBanNicknames = createAction(SET_BAN_NICKNAMES)

export const clearForm = createAction(CLEAR_FORM)
export const clearPage = createAction(CLEAR_PAGE)


const BanNickNameRecord = Record({
    value:"",
    status:"",
    message:""
})

const BanNicknameItemsRecord = Record({
    filter:"all",
    header:List([]),
    origin:Map(),
    items:Map(),    
})

const initialState = Record({
    ban_nicknames_loading:false,
    upload_loading:false,
    deleting_id:"",
    ban_nickname:BanNickNameRecord(),
    ban_nicknames:BanNicknameItemsRecord(),
})();

// const check_num = /[0-9]/; 
// const check_spc = /[~!@#$%^&*()_+|<>?:{}]/; 
const check_eng = /[a-zA-Z]/; 
const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

const getHeader = (filter, items) =>{
    return [...items.keys()].filter(v => {
        if(filter === "english")
            return check_eng.test(v)
        else if(filter === "korean")
            return check_kor.test(v)
        return true
    }).sort()
}

export default handleActions({
    [CHANGE_BAN_NICKNAMES_LOADING]:(state,{payload:loading})=>{
        return state.set("ban_nickname_loading", loading)
    },
    [CHANGE_UPLOAD_LOADING]:(state,{payload:loading})=>{
        return state.set("upload_loading", loading)
    },
    [SET_DELETING_ID]:(state,{payload:id})=>{
        return state.set("deleting_id", id)
    },
    [CHANGE_BAN_NICKNAME]:(state,{payload:value})=>{
        return state.setIn(["ban_nickname", "value"], value)
    },
    [CHANGE_CHECK_BAN_NICKNAME]:(state,{payload:{status, message=""}})=>{
        return state.mergeIn(["ban_nickname"], {
            status, message
        })
    },
    [CHANGE_BAN_NICKNAME_FILTER]:(state,{payload:filter})=>{
        const origin = state.ban_nicknames.origin
        const items = origin.filter(
            (_, k) => 
                (filter=== "english" && check_eng.test(k)) ||
                (filter === "korean" && check_kor.test(k)) ||
                filter === "all"
        )
        const header = getHeader(filter, items)

        return state.mergeIn(["ban_nicknames"], {
            items, filter, header
        })
    },
    [SET_BAN_NICKNAMES]:(state,{payload:ban_nicknames})=>{
        var origin = Map()
        ban_nicknames.forEach(item=>{
            const key = item.nickname.charAt(0).toUpperCase()
            if(origin.has(key))
                origin = origin.update(key, list=>list.push(item))
            else
                origin = origin.set(key, List([item]))
        })

        origin.keySeq().forEach(k => {
            origin = origin.update(k, list=>list.sort((a,b)=>{
                return a.value < b.value ? -1 : a.value > b.value ? 1 : 0
            }))
        })

        const filter = state.ban_nicknames.filter
        var items = origin.filter(
            (_, k) => 
                (filter=== "english" && check_eng.test(k)) ||
                (filter === "korean" && check_kor.test(k)) ||
                filter === "all"
        )

        const header = getHeader(filter, items)

        return state.mergeIn(["ban_nicknames"], {
            origin:origin,
            items:items,
            header:header,
        })
    },
    [CLEAR_FORM]:(state)=>{
        return state.set("ban_nickname", BanNickNameRecord())
    },
    [CLEAR_PAGE]:(state)=>{
        return state.merge({
            ban_nicknames_loading:false,
            upload_loading:false,
            delete_loading:false,
            ban_nickname:BanNickNameRecord(),
            ban_nicknames:BanNicknameItemsRecord(),
        })
    },
}, initialState)