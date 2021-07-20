import { createAction, handleActions } from "redux-actions"
import { Record, List } from "immutable";
import {
    VIEW_TYPE_LIST
} from "const";

const CHANGE_EDIT_LOADING = "curationFolderEdit/CHANGE_EDIT_LOADING"
const CHANGE_GROUPS_LOADING = "curationFolderEdit/CHANGE_GROUPS_LOADING"
const CHANGE_FOLDERS_LOADING = "curationFolderEdit/CHANGE_FOLDERS_LOADING"

const CHANGE_FOLDER_ORDER = "curationFolderEdit/CHANGE_FOLDER_ORDER";

const CHANGE_TITLE = "curationFolderEdit/CHANGE_TITLE";
const CHANGE_SUB_TITLE = "curationFolderEdit/CHANGE_SUB_TITLE";
const CHANGE_DESCRIPTION = "curationFolderEdit/CHANGE_DESCRIPTION"

const CHANGE_DOMINANT_COLOR = "curationFolderEdit/CHANGE_DOMINANT_COLOR"
const LOAD_COVER = "curationFolderEdit/LOAD_COVER";
const SET_COVERS = "curationFolderEdit/SET_COVERS";
const CLEAR_COVER = "curationFolderEdit/CLEAR_COVER";

const SET_GROUPS = "curationFolderEdit/SET_GROUPS";

const SELECT_GROUP = "curationFolderEdit/SELECT_GROUP";

const SET_FOLDERS = "curationFolderEdit/SET_FOLDERS";

const SELECT_FOLDER = "curationFolderEdit/SELECT_FOLDER";

const CLEAR_FORM = "curationFolderEdit/CLEAR_FORM";
const CLEAR_PAGE = "curationFolderEdit/CLEAR_PAGE";

export const changeEditLoading = createAction(CHANGE_EDIT_LOADING)
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

export const selectFolder = createAction(SELECT_FOLDER)

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

const itemToImage = (item) => {
    if (!item || item === "") {
        return ImageRecord()
    }

    return ImageRecord({
        image_size_type: item.image_size_type,
        image_type: item.image_type,
        image: item.image,
        width: item.width,
        height: item.height,
        updated: item.updated,
    })
}

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
    folder_index: null,
    folder: FolderRecord(),
})

const initialState = Record({
    edit_loading: false,
    groups_loading: false,
    folders_loading: false,
    image_loaded: false,
    groups: null,
    selected: SelectedRecord(),
    origin_folders: null,
    folders: null,
})();

const itemsToFolders = (items) => {
    return items.map(folder => {
        return {
            id: folder.id,
            title: folder.title,
            sub_title: folder.sub_title,
            description: folder.description,
            dominant_color: folder.dominant_color,
            order: folder.order,
            origin_cover: itemToImage(folder.origin_cover),
            default_cover: itemToImage(folder.default_cover),
            mini_cover: itemToImage(folder.mini_cover),
            micro_cover: itemToImage(folder.micro_cover),
            updated: folder.updated,
        }
    })
}

export default handleActions({
    [CHANGE_EDIT_LOADING]: (state, { payload: loading }) => {
        return state.set("edit_loading", loading)
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

        if (state.selected.folder_index === null)
            return state.set("folders", folders)

        const folder = state.selected.folder
        const index = folders.findIndex(item => item.id === folder.id)

        return state.set("folders", folders)
            .setIn(["selected", "folder_index"], index)
    },
    [CHANGE_TITLE]: (state, { payload: title }) => {
        if (state.selected.folder_index === null) {
            return state
        }
        return state.setIn(["selected", "folder", "title"], title)
            .update("folders", folders => folders.setIn(
                [state.selected.folder_index, "title"], title
            ))
    },
    [CHANGE_SUB_TITLE]: (state, { payload: sub_title }) => {
        if (state.selected.folder_index === null) {
            return state
        }
        return state.setIn(["selected", "folder", "sub_title"], sub_title)
            .update("folders", folders => folders.setIn(
                [state.selected.folder_index, "sub_title"], sub_title
            ))
    },
    [CHANGE_DESCRIPTION]: (state, { payload: description }) => {
        if (state.selected.folder_index === null) {
            return state
        }
        return state.setIn(["selected", "folder", "description"], description)
            .update("folders", folders => folders.setIn(
                [state.selected.folder_index, "description"], description
            ))
    },
    [CHANGE_DOMINANT_COLOR]: (state, { payload: color }) => {
        if (state.selected.folder_index === null) {
            return state
        }
        return state.setIn(["selected", "folder", "dominant_color"], color)
            .update("folders", folders => folders.setIn(
                [state.selected.folder_index, "dominant_color"], color
            ))
    },
    [LOAD_COVER]: (state, { payload: file }) => {
        if (
            !file ||
            state.selected.folder_index === null
        ) return state

        const cover = {
            origin_cover: createOriginImage(file),
            default_cover: createDefaultImage(),
            mini_cover: createMiniImage(),
            micro_cover: createMicroImage(),
        }

        state = state.set("iamge_loaded", false)
            .mergeIn(["selected", "folder"], cover)
            .update("folders", folders => folders.mergeIn(
                [state.selected.folder_index], cover
            ))
    },
    [SET_COVERS]: (state, { payload: {
        defaultImage, miniImage, microImage
    } }) => {
        if (state.selected.folder_index === null) return state

        const cover = {
            default_cover: createDefaultImage(defaultImage),
            mini_cover: createMiniImage(miniImage),
            micro_cover: createMicroImage(microImage),
        }
        return state.set("image_loaded", true)
            .mergeIn(["selected", "folder"], cover)
            .update("folders", folders => folders.mergeIn(
                [state.selected.folder_index], cover
            ))
    },
    [CLEAR_COVER]: (state) => {
        if (state.selected.folder_index === null) return state

        const cover = {
            origin_cover: createOriginImage(),
            default_cover: createDefaultImage(),
            mini_cover: createMiniImage(),
            micro_cover: createMicroImage(),
        }
        return state.mergeIn(["selected", "folder"], cover)
            .update("folders", folders => folders.mergeIn(
                [state.selected.folder_index], cover
            ))
    },
    [SET_GROUPS]: (state, { payload: groups }) => {
        return state.merge({
            selected: SelectedRecord(),
            groups: List(groups),
            origin_folders: null,
            folders: null,
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
                group_index: index,
            }),
            origin_folders: null,
            folders: null,
        })
    },
    [SET_FOLDERS]: (state, { payload: items }) => {
        const group = state.selected.group
        if (
            group === null ||
            group.view_type === VIEW_TYPE_LIST
        ) return state

        const origin_folders = itemsToFolders(items)
        const folders = itemsToFolders(items)

        return state.mergeIn(["selected"], {
            folder: FolderRecord(),
            folder_index: null,
        }).merge({
            origin_folders: List(origin_folders),
            folders: List(folders),
        })
    },
    [SELECT_FOLDER]: (state, { payload: select }) => {
        if (state.selected.folder !== null) {
            const origin_folder = state.origin_folders.find(
                item => item.id === state.selected.folder.id
            )

            state = state.setIn(["folders", state.selected.folder_index], {
                ...origin_folder
            })
        }

        const index = state.folders.findIndex(item => item.id === select.id)
        if (index === -1) return state

        const folder = state.folders.get(index)
        if (
            state.selected.folder !== null &&
            folder.id === state.selected.folder.id
        ) return state

        return state.mergeIn(["selected"], {
            folder: FolderRecord({ ...folder }),
            folder_index: index,
        })
    },
    [CLEAR_FORM]: (state) => {
        return state.mergeIn(["selected"], {
            folder: FolderRecord(),
            folder_index: null,
        }).merge({
            image_loaded: false,
            origin_folders: null,
            folders: null
        })
    },
    [CLEAR_PAGE]: (state) => {
        return state.merge({
            edit_loading: false,
            groups_loading: false,
            folders_loading: false,
            image_loaded: false,
            groups: null,
            origin_folders: null,
            folders: null,
            selected: SelectedRecord(),
        })
    },
}, initialState)