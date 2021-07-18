
import React, { Component } from "react";
import { connect } from "react-redux";
import CurationThemeUploadTemplate from "./CurationThemeUploadTemplate"

import { CurationList } from "components/Curation"
import { ThemeOrderList } from "components/Theme"
import CheckableTextInput, {
    CHECK_SUCCESS, CHECK_LOADING, CHECK_NONE
} from "components/CheckableTextInput";
import Button from "components/Button";

import {
    CurationThemeUploadActions,
    PopupActions
} from "store/actionCreators"

import { curationAPI, listAPI } from "api";
import { FILTER_REGISTERED } from "components/Theme/ThemeOrderList";
import { VIEW_TYPE_LIST } from "const";

class CurationThemeUploadPage extends Component {
    loadGroups = () => {
        const loader = setTimeout(() => {
            CurationThemeUploadActions.changeGroupsLoading(true)
        }, 300)

        curationAPI.getGroups(
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationThemeUploadActions.changeGroupsLoading(false)
            CurationThemeUploadActions.setGroups(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            CurationThemeUploadActions.changeGroupsLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadFolders = (group_id) => {
        const loader = setTimeout(() => {
            CurationThemeUploadActions.changeFoldersLoading(true)
        }, 300)

        curationAPI.getFolders(
            group_id
        ).then(({ data }) => {
            const folders = data.items
            clearTimeout(loader)
            CurationThemeUploadActions.changeFoldersLoading(false)
            CurationThemeUploadActions.setFolders(folders)
            if (folders.length > 0) {
                const folder = folders[0]
                const { filter } = this.props
                CurationThemeUploadActions.selectFolder(folder)
                this.loadThemes(group_id, folder.id, filter)
            }
        }).catch((error) => {
            clearTimeout(loader)
            CurationThemeUploadActions.changeFoldersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadThemes = (group_id, folder_id, filter) => {
        const loader = setTimeout(() => {
            CurationThemeUploadActions.changeThemesLoading(true)
        }, 300)

        listAPI.getThemes(
            group_id,
            folder_id,
            filter,
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationThemeUploadActions.changeThemesLoading(false)
            CurationThemeUploadActions.setThemes(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            CurationThemeUploadActions.changeThemesLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleChangeSearch = (value) => {
        CurationThemeUploadActions.changeSearch(value)
    }

    loadSearchThemes = (filter, search) => {
        const {
            group_id,
            folder_id,
        } = this.props.selected

        listAPI.getThemes(
            group_id,
            folder_id,
            filter,
            search
        ).then(({ data }) => {
            CurationThemeUploadActions.changeCheckSearch(CHECK_SUCCESS)
            CurationThemeUploadActions.setSearchThemes(data.items)
        }).catch((error) => {
            CurationThemeUploadActions.changeCheckSearch(CHECK_NONE)
            PopupActions.showResponseError(error)
        })
    }

    handleCheckSearch = (value) => {
        const { filter } = this.props
        this.loadSearchThemes(filter, value)
    }

    handleChangeStatusSearch = (status) => {
        CurationThemeUploadActions.changeCheckSearch(status)
        if (status === CHECK_NONE) {
            const {
                selected: { group_id, folder_id },
                filter,
            } = this.props
            this.loadThemes(group_id, folder_id, filter)
        }
    }

    handleChangeFilter = (filter) => {
        const {
            selected: { group_id, folder_id },
            search: { value, status }
        } = this.props

        CurationThemeUploadActions.changeFilter(filter)
        if (status === CHECK_SUCCESS) {
            this.loadSearchThemes(filter, value)
        }
        else {
            this.loadThemes(group_id, folder_id, filter)
        }
    }

    handleSelectedGroup = (item) => {
        CurationThemeUploadActions.selectGroup(item)
        if (item.view_type === VIEW_TYPE_LIST) {
            const { folder_id } = this.props.selected
            this.loadThemes(item.id, folder_id, FILTER_REGISTERED)
        }
        else {
            this.loadFolders(item.id)
        }
    }

    handleSelectedFolder = (item) => {
        const { group_id } = this.props.selected
        CurationThemeUploadActions.selectFolder(item)
        this.loadThemes(group_id, item.id, FILTER_REGISTERED)
    }

    handleOnOutClickTheme = () => {
        CurationThemeUploadActions.unselectTheme()
    }

    handleSelectTheme = (item) => {
        CurationThemeUploadActions.selectTheme(item)
    }

    isValidUpload = () => {
        const {
            enable_upload,
            selected: { theme },
            filter,
        } = this.props

        if (!enable_upload) {
            if (filter === FILTER_REGISTERED) {
                PopupActions.showMessage("이미 등록된 테마 입니다.")
            }
            else if (theme === null) {
                PopupActions.showMessage("테마를 선택해주세요.")
            }
            else {
                PopupActions.showMessage("업로드를 실패했습니다.")
            }
            return false;
        }
        return true;
    }

    handleUploadTheme = () => {
        if (
            this.props.upload_loading ||
            !this.isValidUpload()
        ) return;

        PopupActions.show({
            content: "배경화면을 추가 하시겠습니까?",
            oneBtn: false,
            onConfirm: this.handleUploadConfirm,
        })
    }

    handleUploadConfirm = () => {
        const {
            selected: {
                group_id,
                folder_id,
                theme_id,
            },
            search: { value },
            filter,
        } = this.props

        const loader = setTimeout(() => {
            CurationThemeUploadActions.changeUploadLoading(true)
        }, 300)

        listAPI.uploadThemeList(
            group_id,
            folder_id,
            theme_id,
        ).then(() => {
            clearTimeout(loader)
            CurationThemeUploadActions.changeUploadLoading(false)
            CurationThemeUploadActions.unselectTheme()
            if (value !== "") {
                this.loadSearchThemes(filter, value)
            }
            this.loadThemes(group_id, folder_id, filter)
        }).catch((error) => {
            clearTimeout(loader)
            CurationThemeUploadActions.changeUploadLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    componentDidMount() {
        this.loadGroups()
    }

    componentWillUnmount() {
        CurationThemeUploadActions.clearPage()
    }

    render() {
        const {
            enable_search,
            enable_upload,
            themes_loading,
            groups_loading,
            folders_loading,
            upload_loading,
            search,
            selected: { group_id, folder_id, theme_id },
            filter,
            groups,
            folders,
            themes, } = this.props
        return (
            <CurationThemeUploadTemplate
                searchInput={
                    <CheckableTextInput
                        placeholder="검색어를 입력하세요"
                        enable={enable_search}
                        showCheckIcon={false}
                        value={search.value}
                        status_check={search.status}
                        onChange={this.handleChangeSearch}
                        onCheck={this.handleCheckSearch}
                        onChangeStatus={this.handleChangeStatusSearch} />
                }
                groupList={
                    <CurationList
                        enable_folders={true}
                        loading_groups={groups_loading}
                        loading_folders={folders_loading}
                        selected_group={group_id}
                        selected_folder={folder_id}
                        groups={groups}
                        folders={folders}
                        onSelectedGroup={this.handleSelectedGroup}
                        onSelectedFolder={this.handleSelectedFolder} />
                }
                themeList={
                    <ThemeOrderList
                        enable={enable_search}
                        loading={themes_loading}
                        items={themes}
                        selected={theme_id}
                        filter={filter}
                        onOutClick={this.handleOnOutClickTheme}
                        onClick={this.handleSelectTheme}
                        onChangeFilter={this.handleChangeFilter} />
                }
                uploadBtn={
                    <Button
                        enable={enable_upload}
                        loading={upload_loading}
                        icon={{
                            enable: "/icon/ic_folder_upload_enable.svg",
                            disable: "/icon/ic_folder_upload_disable.svg"
                        }}
                        onClick={this.handleUploadTheme}>배경화면 추가</Button>
                } />
        )
    }
}

export default connect(
    ({ curationThemeUpload }) => {
        const { group, folder, theme } = curationThemeUpload.selected
        const { search, filter } = curationThemeUpload
        const enable_search = (
            (group !== null && group.view_type === VIEW_TYPE_LIST) ||
            folder !== null
        )
        const themes_loading = curationThemeUpload.themes_loading || search.status === CHECK_LOADING
        var themes = curationThemeUpload.themes
        if (search.status === CHECK_SUCCESS) {
            themes = search.themes
        }
        const enable_upload = (
            filter !== FILTER_REGISTERED &&
            theme !== null
        )

        return {
            enable_search: enable_search,
            enable_upload: enable_upload,
            themes_loading: themes_loading,
            groups_loading: curationThemeUpload.groups_loading,
            folders_loading: curationThemeUpload.folders_loading,
            upload_loading: curationThemeUpload.upload_loading,
            search: curationThemeUpload.search,
            selected: curationThemeUpload.selected,
            filter: curationThemeUpload.filter,
            groups: curationThemeUpload.groups,
            folders: curationThemeUpload.folders,
            themes: themes,
        }
    }
)(CurationThemeUploadPage);