import React, { Component } from "react";
import { connect } from "react-redux";
import CurationFolderEditTemplate from "./CurationFolderEditTemplate"

import { CurationFolderEditActions } from "store/actionCreators";
import { CurationList } from "components/Curation";
import TextInput from "components/TextInput";
import ContentView from "components/ContentView";
import Button from "components/Button";

import { PopupActions } from "store/actionCreators"

import { curationAPI } from "api";
import {
    VIEW_TYPE_L_HORIZON,
    VIEW_TYPE_M_HORIZON,
    VIEW_TYPE_SQUARE_ALBUM,
    VIEW_TYPE_S_HORIZON,
    VIEW_TYPE_LIST,
    COVER_SIZE,
} from "const";

class CurationFolderEditPage extends Component {
    coverRef = React.createRef()

    loadGroups = () => {
        const loader = setTimeout(() => {
            CurationFolderEditActions.changeGroupsLoading(true)
        }, 300)
        curationAPI.getGroups(
            true
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationFolderEditActions.changeGroupsLoading(false)
            CurationFolderEditActions.setGroups(data)
        }).catch((error) => {
            clearTimeout(loader)
            CurationFolderEditActions.changeGroupsLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadFolders = (group_id) => {
        const loader = setTimeout(() => {
            CurationFolderEditActions.changeFoldersLoading(true)
        }, 300)
        curationAPI.getFolders(
            group_id
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationFolderEditActions.changeFoldersLoading(false)
            CurationFolderEditActions.setFolders(data)
        }).catch((error) => {
            clearTimeout(loader)
            CurationFolderEditActions.changeFoldersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleChangeTitle = (value) => {
        CurationFolderEditActions.changeTitle(value)
    }

    handleChangeSubTitle = (value) => {
        CurationFolderEditActions.changeSubTitle(value)
    }

    handleChangeDescription = (value) => {
        CurationFolderEditActions.changeDescription(value)
    }

    handleMoveFolder = (result) => {
        CurationFolderEditActions.changeFolderOrder(result)
    }

    handleSelectGroup = (group) => {
        CurationFolderEditActions.selectGroup(group)
        this.loadFolders(group.id)
    }

    handleSelectFolder = (folder) => {
        CurationFolderEditActions.selectFolder(folder)
    }

    _captureImage = (image, view_type) => {
        if (!image) return

        const cover_size = COVER_SIZE[view_type]
        if (!cover_size) return

        const defaultImage = image.capture("jpg", cover_size.width, cover_size.height)
        const miniImage = image.capture("jpg", cover_size.width / 2, cover_size.height / 2)
        const microImage = image.capture("jpg", cover_size.width / 4, cover_size.height / 4)

        return {
            defaultImage: defaultImage,
            miniImage: miniImage,
            microImage: microImage,
        }
    }

    validCoverFile = (view_type, file) => {
        const cover_size = COVER_SIZE[view_type]
        return cover_size &&
            file.width === cover_size.width &&
            file.height === cover_size.height
    }

    handleCoverOnLoadFiles = (lists) => {
        const { group } = this.props.selected
        if (
            group === null ||
            group.view_type === VIEW_TYPE_LIST ||
            lists.length === 0
        ) return;

        for (var i = 0; i < lists.length; i++) {
            if (this.validCoverFile(group.view_type, lists[i])) {
                CurationFolderEditActions.loadCover(lists[i])
                return;
            }
        }

        PopupActions.showMessage("크기가 맞지 않는 이미지입니다.")
    }

    handleCoverOnLoaded = () => {
        const { image_loaded } = this.props
        if (image_loaded) return;

        const {
            group
        } = this.props.selected

        if (
            !group === null ||
            group.view_type === VIEW_TYPE_LIST
        ) return;

        const image = this._captureImage(
            this.coverRef.current,
            group.view_type,
        )

        CurationFolderEditActions.setCovers(image)
    }

    handleCoverOnClear = () => {
        CurationFolderEditActions.clearCover()
    }

    isValidDelete = () => {
        const {
            enable_delete,
            selected: { folder_index }
        } = this.props

        if (!enable_delete) {
            if (folder_index === null) {
                PopupActions.showMessage("폴더를 선택해주세요.")
            }
            return false
        }

        return true
    }

    handleDeleteFolder = () => {
        if (
            this.props.edit_loading ||
            !this.isValidDelete()
        ) return

        PopupActions.show({
            content: "정말로 삭제하시겠습니까?",
            onBtn: false,
            onConfirm: this.handleDeleteConfirm,
        })
    }

    handleDeleteConfirm = () => {
        const {
            selected: { group, folder }
        } = this.props

        const loader = setTimeout(() => {
            CurationFolderEditActions.changeEditLoading(true)
        }, 300)

        curationAPI.deleteFolder(
            folder.id
        ).then(({ status }) => {
            clearTimeout(loader)
            CurationFolderEditActions.changeEditLoading(false)
            CurationFolderEditActions.clearForm()
            this.loadFolders(group.id)
            if (status === 200) {
                PopupActions.showMessage("폴더를 삭제했습니다")
            }
            else if (status === 204) {
                PopupActions.showMessage("폴더를 찾을수 없습니다")
            }
        }).catch((error) => {
            clearTimeout(loader)
            CurationFolderEditActions.changeEditLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    isValidUpdate = () => {
        const {
            enable_update,
            selected: { folder, folder_index },
        } = this.props

        if (!enable_update) {
            if (folder_index === null) {
                PopupActions.showMessage("폴더를 선택해주세요")
            }
            else if (folder.title === "") {
                PopupActions.showMessage("제목을 정해주세요")
            }
            else if (folder.sub_title === "") {
                PopupActions.showMessage("소제목을 정해주세요")
            }
            else if (folder.description === "") {
                PopupActions.showMessage("설명글을 정해주세요")
            }
            else {
                PopupActions.showMessage("변경사항이 없습니다.")
            }
            return false
        }

        return true
    }

    handleUpdateFolder = () => {
        if (
            this.props.edit_loading ||
            !this.isValidUpdate()
        ) return;

        PopupActions.show({
            content: "정말로 수정하시겠습니까?",
            oneBtn: false,
            onConfirm: this.handleUpdateConfirm,
        })
    }

    handleUpdateConfirm = () => {
        const {
            origin_folders,
            folders,
            selected: { group, folder, folder_index }
        } = this.props

        const loader = setTimeout(() => {
            CurationFolderEditActions.changeEditLoading(true)
        }, 300)

        curationAPI.updateFolder(
            origin_folders,
            folders,
            folder,
            folder_index,
        ).then(({ status }) => {
            clearTimeout(loader)
            CurationFolderEditActions.changeEditLoading(false)
            CurationFolderEditActions.clearForm()
            this.loadFolders(group.id)
            if (status === 200) {
                PopupActions.showMessage("폴더를 수정했습니다.")
            }
            else if (status === 204) {
                PopupActions.showMessage("폴더를 찾을수 없습니다.")
            }
        }).catch((error) => {
            clearTimeout(loader)
            CurationFolderEditActions.changeEditLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    getCoverWidth = (view_type) => {
        if (!view_type) return "0px"

        if (view_type === VIEW_TYPE_L_HORIZON) return "450px"
        else if (view_type === VIEW_TYPE_M_HORIZON) return "390px"
        else if (view_type === VIEW_TYPE_S_HORIZON) return "315px"
        else if (view_type === VIEW_TYPE_SQUARE_ALBUM) return "240px"

        return "0px"
    }

    componentDidMount() {
        this.loadGroups()
    }

    componentWillUnmount() {
        CurationFolderEditActions.clearPage()
    }

    render() {
        const { enable_delete,
            enable_update,
            enable_edit,
            edit_loading,
            groups_loading,
            folders_loading,
            view_type,
            groups,
            selected,
            selected_group_id,
            selected_folder_id,
            folders,
            cover
        } = this.props

        return <>
            <CurationFolderEditTemplate
                viewType={view_type}
                groupList={
                    <CurationList
                        enable_folders={true}
                        draggable_folder={true}
                        loading_groups={groups_loading}
                        loading_folders={folders_loading}
                        selected_group={selected_group_id}
                        selected_folder={selected_folder_id}
                        groups={groups}
                        folders={folders}
                        onMoveFolder={this.handleMoveFolder}
                        onSelectedGroup={this.handleSelectGroup}
                        onSelectedFolder={this.handleSelectFolder} />
                }
                titleInput={
                    <TextInput
                        label="제목"
                        enable={enable_edit}
                        value={selected.folder.title}
                        maxLength={10}
                        showRemainText={true}
                        placeholder="제목을 입력하세요"
                        onChange={this.handleChangeTitle} />
                }
                subTitleInput={
                    <TextInput
                        label="소제목"
                        enable={enable_edit}
                        value={selected.folder.sub_title}
                        maxLength={16}
                        showRemainText={true}
                        placeholder="소제목을 입력하세요"
                        onChange={this.handleChangeSubTitle} />
                }
                descriptionInput={
                    <TextInput
                        label="설명글"
                        enable={enable_edit}
                        value={selected.folder.description}
                        maxLength={16}
                        showRemainText={true}
                        placeholder="설명글을 입력하세요"
                        onChange={this.handleChangeDescription} />
                }
                coverImage={
                    <ContentView
                        ref={this.coverRef}
                        label="커버 이미지"
                        enable={enable_edit}
                        labelStyle={{
                            fontSize: "16px"
                        }}
                        contentStyle={{
                            width: this.getCoverWidth(view_type),
                            height: "240px"
                        }}
                        value={cover}
                        default_value="/icon/ic_insert_photo.svg"
                        contentType="image"
                        onLoadFiles={this.handleCoverOnLoadFiles}
                        onLoadedContent={this.handleCoverOnLoaded}
                        onClear={this.handleCoverOnClear} />
                }
                deleteBtn={<Button
                    icon={{
                        enable: "/icon/ic_delet_enable.svg",
                        disable: "/icon/ic_delet_disable.svg"
                    }}
                    enable={enable_delete}
                    loading={edit_loading}
                    onClick={this.handleDeleteFolder}>폴더 삭제</Button>}
                updateBtn={<Button
                    icon={{
                        enable: "/icon/ic_edit_enable.svg",
                        disable: "/icon/ic_edit_disable.svg",
                    }}
                    enable={enable_update}
                    loading={edit_loading}
                    onClick={this.handleUpdateFolder}>폴더 수정</Button>} />
        </>
    }
}

export default connect(
    ({ curationFolderEdit }) => {
        const {
            selected: {
                group,
                folder,
                folder_index
            },
            origin_folders,
            folders
        } = curationFolderEdit

        const is_selected = folder_index !== null

        const enable_delete = is_selected;
        const enable_edit = is_selected;

        var update_orders = false
        var enable_update = false
        if (
            folders !== null &&
            origin_folders !== null
        ) {
            for (var i = 0; i < origin_folders.size; i++) {
                if (origin_folders.get(i).order !== folders.get(i).order) {
                    update_orders = true
                    break;
                }
            }

            enable_update = update_orders

            const origin = origin_folders.find(item => item.id === folder.id)
            if (origin) {
                const update_title = (
                    folder.title !== "" &&
                    folder.title !== origin.title
                )

                const update_sub_title = (
                    folder.sub_title !== "" &&
                    folder.sub_title !== origin.sub_title
                )

                const update_description = (
                    folder.description !== "" &&
                    folder.description !== origin.description
                )

                const update_cover = (
                    folder.origin_cover.file !== null &&
                    folder.default_cover.file !== null &&
                    folder.mini_cover.file !== null &&
                    folder.micro_cover.file !== null &&
                    folder.origin_cover.image !== origin.origin_cover.image
                )

                enable_update = enable_update || (
                    is_selected && (
                        update_title ||
                        update_sub_title ||
                        update_description ||
                        update_cover
                    )
                )
            }
        }

        var cover = folder.default_cover.image
        if (cover === "") {
            cover = folder.origin_cover.image
        }

        return {
            enable_delete: enable_delete,
            enable_update: enable_update,
            enable_edit: enable_edit,
            edit_loading: curationFolderEdit.edit_loading,
            groups_loading: curationFolderEdit.groups_loading,
            folders_loading: curationFolderEdit.folders_loading,
            image_loaded: curationFolderEdit.image_loaded,
            view_type: group !== null ? group.view_type : null,
            groups: curationFolderEdit.groups,
            selected: curationFolderEdit.selected,
            selected_group_id: group !== null ? group.id : null,
            selected_folder_id: folder !== null ? folder.id : null,
            origin_folders: curationFolderEdit.origin_folders,
            folders: curationFolderEdit.folders,
            cover: cover,
        }
    }
)(CurationFolderEditPage);