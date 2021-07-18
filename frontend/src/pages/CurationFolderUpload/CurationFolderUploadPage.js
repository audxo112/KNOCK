import React, { Component } from "react";
import { connect } from "react-redux";
import CurationFolderUploadTemplate from "./CurationFolderUploadTemplate"

import {
    CurationFolderUploadActions,
    PopupActions
} from "store/actionCreators";

import TextInput from "components/TextInput";
import ContentView from "components/ContentView";
import Button from "components/Button";
import { CurationList } from "components/Curation";

import { curationAPI } from "api";
import {
    VIEW_TYPE_L_HORIZON,
    VIEW_TYPE_M_HORIZON,
    VIEW_TYPE_SQUARE_ALBUM,
    VIEW_TYPE_S_HORIZON,
    VIEW_TYPE_LIST,
    COVER_SIZE,
} from "const";

class CurationFolderUploadPage extends Component {
    coverRef = React.createRef()

    loadGroups = () => {
        const loader = setTimeout(() => {
            CurationFolderUploadActions.changeGroupsLoading(true)
        }, 300)
        curationAPI.getGroups(
            true
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationFolderUploadActions.changeGroupsLoading(false)
            CurationFolderUploadActions.setGroups(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            CurationFolderUploadActions.changeGroupsLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadFolders = (group_id, refresh = false) => {
        const loader = setTimeout(() => {
            CurationFolderUploadActions.changeFoldersLoading(true)
        }, 300)
        curationAPI.getFolders(group_id).then(({ data }) => {
            clearTimeout(loader)
            CurationFolderUploadActions.changeFoldersLoading(false)
            if (refresh)
                CurationFolderUploadActions.refreshFolders(data.items)
            else
                CurationFolderUploadActions.setFolders(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            CurationFolderUploadActions.changeFoldersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleChangeTitle = (value) => {
        CurationFolderUploadActions.changeTitle(value)
    }

    handleChangeSubTitle = (value) => {
        CurationFolderUploadActions.changeSubTitle(value)
    }

    handleChangeDescription = (value) => {
        CurationFolderUploadActions.changeDescription(value)
    }

    handleSelectGroup = (group) => {
        CurationFolderUploadActions.selectGroup(group)
        this.loadFolders(group.id)
    }

    handleOnMove = (result) => {
        CurationFolderUploadActions.changeFolderOrder(result)
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
                CurationFolderUploadActions.loadCover(lists[i])
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

        CurationFolderUploadActions.setCovers(image)
    }

    handleCoverOnClear = () => {
        CurationFolderUploadActions.clearCover()
    }

    isValidUpload = () => {
        const {
            enable_upload,
            selected,
            folder
        } = this.props

        if (!enable_upload) {
            if (selected.group === null) {
                PopupActions.showMessage("그룹을 정해주세요")
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
            else if (
                folder.origin_cover.file === null ||
                folder.default_cover.file === null ||
                folder.mini_cover.file === null ||
                folder.micro_cover.file === null
            ) {
                PopupActions.showMessage("커버 이미지를 정해주세요")
            }
            return false
        }

        return true
    }

    handleUploadGroup = () => {
        if (
            this.props.upload_loading ||
            !this.isValidUpload()
        ) return;

        const loader = setTimeout(() => {
            CurationFolderUploadActions.changeUploadLoading(true)
        }, 300)

        const {
            selected, origin_folders, folders, folder
        } = this.props

        curationAPI.uploadFolder(
            selected.group, origin_folders, folders, folder
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationFolderUploadActions.changeUploadLoading(false)
            CurationFolderUploadActions.clearForm()

            PopupActions.showMessage("업로드가 완료됐습니다.")
            this.loadFolders(selected.group.id)
        }).catch((error) => {
            clearTimeout(loader)
            CurationFolderUploadActions.changeUploadLoading(false)
            PopupActions.showResponseError(error)
            if (error.response && error.response.status === 400) {
                this.loadFolders(selected.group.id, true)
            }
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
        CurationFolderUploadActions.clearPage()
    }

    render() {
        const {
            enable_upload,
            upload_loading,
            groups_loading,
            folders_loading,
            view_type,
            selected_group_id,
            groups,
            folders,
            folder,
            cover,
        } = this.props

        return <>
            <CurationFolderUploadTemplate
                viewType={view_type}
                groupList={
                    <CurationList
                        enable_folders={true}
                        draggable_folder={true}
                        loading_groups={groups_loading}
                        loading_folders={folders_loading}
                        selected_group={selected_group_id}
                        groups={groups}
                        folders={folders}
                        onMoveFolder={this.handleOnMove}
                        onSelectedGroup={this.handleSelectGroup} />
                }
                titleInput={
                    <TextInput
                        label="제목"
                        value={folder.title}
                        maxLength={10}
                        showRemainText={true}
                        placeholder="제목을 입력하세요"
                        onChange={this.handleChangeTitle} />
                }
                subTitleInput={
                    <TextInput
                        label="소제목"
                        value={folder.sub_title}
                        maxLength={16}
                        showRemainText={true}
                        placeholder="소제목을 입력하세요"
                        onChange={this.handleChangeSubTitle} />
                }
                descriptionInput={
                    <TextInput
                        label="설명글"
                        value={folder.description}
                        maxLength={16}
                        showRemainText={true}
                        placeholder="설명글을 입력하세요"
                        onChange={this.handleChangeDescription} />
                }
                coverImage={
                    <ContentView
                        ref={this.coverRef}
                        label="커버 이미지"
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
                uploadBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_folder_upload_enable.svg",
                            disable: "/icon/ic_folder_upload_disable.svg"
                        }}
                        enable={enable_upload}
                        loading={upload_loading}
                        onClick={this.handleUploadGroup}
                    >폴더 추가</Button>
                } />
        </>
    }
}

export default connect(
    ({ curationFolderUpload }) => {
        const { selected, folder } = curationFolderUpload
        const valid_cover = (
            folder.origin_cover.file !== null &&
            folder.default_cover.file !== null &&
            folder.mini_cover.file !== null &&
            folder.micro_cover.file !== null
        )

        const enable_upload =
            selected.group !== null &&
            folder.title !== "" &&
            folder.sub_title !== "" &&
            folder.description !== "" &&
            valid_cover;

        var cover = folder.default_cover.image
        if (cover === "") {
            cover = folder.origin_cover.image
        }

        return {
            enable_upload: enable_upload,
            view_type: selected.group !== null ? selected.group.view_type : null,
            upload_loading: curationFolderUpload.upload_loading,
            groups_loading: curationFolderUpload.groups_loading,
            folders_loading: curationFolderUpload.folders_loading,
            image_loaded: curationFolderUpload.image_loaded,
            groups: curationFolderUpload.groups,
            selected: selected,
            selected_group_id: selected.group !== null ? selected.group.id : null,
            origin_folders: curationFolderUpload.origin_folders,
            folders: curationFolderUpload.folders,
            folder: curationFolderUpload.folder,
            cover: cover,
            current_index: curationFolderUpload.current_index,
        }
    }
)(CurationFolderUploadPage);