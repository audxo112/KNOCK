import { createAction, handleActions } from "redux-actions"
import { Record, List } from "immutable";
import {
    VIEW_TYPE_LIST
} from "const";

const CHANGE_UPLOAD_LOADING = "curationFolderUpload/CHANGE_UPLOAD_LOADING";
const CHANGE_GROUPS_LOADING = "curationFolderUpload/CHANGE_GROUPS_LOADING";
const CHANGE_FOLDERS_LOADING = "curationFolderUpload/CHANGE_FOLDERS_LOADING";

const CHANGE_FOLDER_ORDER = "curationFolderUpload/CHANGE_FOLDER_ORDER";

const CHANGE_TITLE = "curationFolderUpload/CHANGE_TITLE";
const CHANGE_SUB_TITLE = "curationFolderUpload/CHANGE_SUB_TITLE";
const CHANGE_DESCRIPTION = "curationFolderUpload/CHANGE_DESCRIPTION";

const CHANGE_DOMINANT_COLOR = "curationFolderUpload/CHANGE_DOMINANT_COLOR";
const LOAD_COVER = "curationFolderUpload/LOAD_COVER";
const SET_COVERS = "curationFolderUpload/SET_COVERS";
const CLEAR_COVER = "curationFolderUpload/CLEAR_COVER";

const SET_GROUPS = "curationFolderUpload/SET_GROUPS";

const SELECT_GROUP = "curationFolderUpload/SELECT_GROUP";

const SET_FOLDERS = "curationFolderUpload/SET_FOLDERS";
const REFRESH_FOLDERS = "curationFolderUpload/REFRESH_FOLDERS";

const CLEAR_FORM = "curationFolderUpload/CLEAR_FORM";
const CLEAR_PAGE = "curationFolderUpload/CLEAR_PAGE";

export const changeUploadLoading = createAction(CHANGE_UPLOAD_LOADING)
export const changeGroupsLoading = createAction(CHANGE_GROUPS_LOADING)
export const changeFoldersLoading = createAction(CHANGE_FOLDERS_LOADING)

export const changeFolderOrder = createAction(CHANGE_FOLDER_ORDER)

export const changeTitle = createAction(CHANGE_TITLE)
export const changeSubTitle = createAction(CHANGE_SUB_TITLE)
export const changeDescription = createAction(CHANGE_DESCRIPTION)

export const changeDominantColor = createAction(CHANGE_DOMINANT_COLOR)
export const loadCover = createAction(LOAD_COVER)
export const setCovers = createAction(SET_COVERS)
export const clearCover = createAction(CLEAR_COVER)

export const setGroups = createAction(SET_GROUPS)

export const selectGroup = createAction(SELECT_GROUP)

export const setFolders = createAction(SET_FOLDERS)
export const refreshFolders = createAction(REFRESH_FOLDERS)

export const clearForm = createAction(CLEAR_FORM)
export const clearPage = createAction(CLEAR_PAGE)

const ImageRecord = Record({
    file: null,
    image_size_type: "",
    image_type: "",
    image: "",
    width: 0,
    height: 0,
    updated: new Date(),
})

// const itemToImage = (item) => {
//     if (!item || item === "") {
//         return ImageRecord()
//     }

//     return ImageRecord({
//         image_size_type: item.image_size_type,
//         image_type: item.image_type,
//         image: item.image,
//         width: item.width,
//         height: item.height,
//         updated: item.updated,
//     })
// }

const createImage = (size_type, item = null) => {
    if (!item) {
        return ImageRecord({
            image_size_type: size_type
        })
    }

    return ImageRecord({
        file: item.file,
        image_size_type: size_type,
        image_type: item.type,
        image: item.url,
        width: item.width,
        height: item.height,
        updated: item.updated,
    })
}

const createOriginImage = (item = null) => createImage("origin", item)
const createDefaultImage = (item = null) => createImage("default", item)
const createMiniImage = (item = null) => createImage("mini", item)
const createMicroImage = (item = null) => createImage("micro", item)

const FolderRecord = Record({
    id: "",
    title: "",
    sub_title: "",
    description: "",
    dominant_color: "#000000",
    order: 0,
    origin_cover: createOriginImage(),
    default_cover: createDefaultImage(),
    mini_cover: createMiniImage(),
    micro_cover: createMicroImage(),
})

const SelectedRecord = Record({
    group_index: null,
    group: null,
})

const initialState = Record({
    upload_loading: false,
    groups_loading: false,
    folders_loading: false,
    image_loaded: false,
    groups: null,
    selected: SelectedRecord(),
    origin_folders: null,
    folders: null,
    folder: FolderRecord(),
    current_index: null,
})();

export default handleActions({
    [CHANGE_UPLOAD_LOADING]: (state, { payload: loading }) => {
        return state.set("upload_loading", loading)
    },
    [CHANGE_GROUPS_LOADING]: (state, { payload: loading }) => {
        return state.set("groups_loading", loading)
    },
    [CHANGE_FOLDERS_LOADING]: (state, { payload: loading }) => {
        return state.set("folders_loading", loading)
    },
    [CHANGE_FOLDER_ORDER]: (state, { payload: { src, dst } }) => {
        if (state.folders === null)
            return state

        const old = state.getIn(["folders", src])
        const folders = state.get("folders")
            .delete(src)
            .insert(dst, old)

        const current_index = folders.findIndex(item => item.id === "")

        return state.set("current_index", current_index)
            .set("folders", folders)
    },
    [CHANGE_TITLE]: (state, { payload: title }) => {
        state = state.setIn(["folder", "title"], title)
        if (state.folders === null) {
            return state
        }
        return state.update("folders", folders => folders.setIn(
            [state.current_index, "title"], title
        ))
    },
    [CHANGE_SUB_TITLE]: (state, { payload: sub_title }) => {
        state = state.setIn(["folder", "sub_title"], sub_title)
        if (state.folders === null) {
            return state
        }
        return state.update("folders", folders => folders.setIn(
            [state.current_index, "sub_title"], sub_title
        ))
    },
    [CHANGE_DESCRIPTION]: (state, { payload: description }) => {
        state = state.setIn(["folder", "description"], description)
        if (state.folders === null) {
            return state
        }
        return state.update("folders", folders => folders.setIn(
            [state.current_index, "description"], description
        ))
    },
    [CHANGE_DOMINANT_COLOR]: (state, { paylod: color }) => {
        state = state.setIn(["folder", "dominant_color"], color)
        if (state.folders === null) {
            return state
        }
        return state.update("folders", folders => folders.setIn(
            [state.current_index, "dominant_color"], color
        ))
    },
    [LOAD_COVER]: (state, { payload: file }) => {
        if (!file) return state

        const cover = {
            origin_cover: createOriginImage(file),
            default_cover: createDefaultImage(),
            mini_cover: createMiniImage(),
            micro_cover: createMicroImage(),
        }
        state = state.set("image_loaded", false)
            .mergeIn(["folder"], cover)

        if (state.folders === null) return state

        return state.update("folders", folders => folders.mergeIn(
            [state.current_index], cover
        ))
    },
    [SET_COVERS]: (state, { payload: {
        defaultImage, miniImage, microImage
    } }) => {
        const cover = {
            default_cover: createDefaultImage(defaultImage),
            mini_cover: createMiniImage(miniImage),
            micro_cover: createMicroImage(microImage),
        }
        state = state.set("image_loaded", true)
            .mergeIn(["folder"], cover)

        if (state.folders === null) return state

        return state.update("folders", folders => folders.mergeIn(
            [state.current_index], cover
        ))
    },
    [CLEAR_COVER]: (state) => {
        const cover = {
            origin_cover: createOriginImage(),
            default_cover: createDefaultImage(),
            mini_cover: createMiniImage(),
            micro_cover: createMicroImage(),
        }
        state = state.setIn(["folder"], cover)

        if (state.folders === null) return state

        return state.update("folders", folders => folders.mergeIn(
            [state.current_index], cover
        ))
    },
    [SET_GROUPS]: (state, { payload: groups }) => {
        return state.merge({
            selected: SelectedRecord(),
            groups: List(groups),
            origin_folders: null,
            folders: null,
            current_index: null,
            folder: FolderRecord(),
        })
    },
    [SELECT_GROUP]: (state, { payload: select }) => {
        const index = state.groups.findIndex(item => item.id === select.id)
        if (index === -1) return state

        const group = state.groups.get(index)
        if (
            state.selected.group !== null &&
            group.id === state.selected.group.id
        ) return state

        return state.merge({
            selected: SelectedRecord({
                group: group,
                group_index: index
            }),
            origin_folders: null,
            folders: null,
            current_index: null,
            folder: FolderRecord(),
        })
    },
    [SET_FOLDERS]: (state, { payload: folders }) => {
        const group = state.selected.group
        if (group === null) return state

        if (group.view_type === VIEW_TYPE_LIST) {
            return state.merge({
                origin_folders: List([]),
                folders: List([]),
                current_index: null,
            })
        }

        folders.unshift({
            ...state.folder.toJS()
        })

        return state.merge({
            origin_folders: List(folders),
            folders: List(folders),
            current_index: 0,
        })
    },
    [REFRESH_FOLDERS]: (state, { payload: folders }) => {
        folders.unshift({
            ...state.getIn(["folders", state.current_index])
        })
        return state.merge({
            origin_folders: List(folders),
            folders: List(folders),
            current_index: 0,
        })
    },
    [CLEAR_FORM]: (state) => {
        return state.merge({
            image_loaded: false,
            origin_folders: null,
            folders: null,
            folder: FolderRecord(),
            current_index: null,
        })
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            upload_loading: false,
            groups_loading: false,
            folders_loading: false,
            image_loaded: false,
            groups: null,
            selected: SelectedRecord(),
            origin_folders: null,
            folders: null,
            folder: FolderRecord(),
            current_index: null,
        })
    },
}, initialState)