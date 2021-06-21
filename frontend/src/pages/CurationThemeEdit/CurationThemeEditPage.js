import React, { Component } from "react";
import { connect } from "react-redux";
import CurationThemeEditTemplate from "./CurationThemeEditTemplate"

import { CurationList } from "components/Curation"
import { ThemeOrderList, FILTER_REGISTERED } from "components/Theme"
import CheckableTextInput, {
    CHECK_SUCCESS, CHECK_LOADING, CHECK_NONE
} from "components/CheckableTextInput";
import Button from "components/Button";

import {
    CurationThemeEditActions,
    FrameListActions,
    PopupActions
} from "store/actionCreators"

import { curationAPI, listAPI } from "api";
import { VIEW_TYPE_LIST } from "const";

class CurationThemeEditPage extends Component {
    loadGroups = () => {
        const loader = setTimeout(() => {
            CurationThemeEditActions.changeGroupsLoading(true)
        }, 300)

        curationAPI.getGroups(
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationThemeEditActions.changeGroupsLoading(false)
            CurationThemeEditActions.setGroups(data)
        }).catch((error) => {
            clearTimeout(loader)
            CurationThemeEditActions.changeGroupsLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadFolders = (group_id) => {
        const loader = setTimeout(() => {
            CurationThemeEditActions.changeFoldersLoading(true)
        }, 300)

        curationAPI.getFolders(
            group_id
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationThemeEditActions.changeFoldersLoading(false)
            CurationThemeEditActions.setFolders(data)
            if (data.length > 0) {
                const folder = data[0]
                CurationThemeEditActions.selectFolder(folder)
                this.loadThemes(group_id, folder.id)
            }
        }).catch((error) => {
            clearTimeout(loader)
            CurationThemeEditActions.changeFoldersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadThemes = (group_id, folder_id) => {
        const loader = setTimeout(() => {
            CurationThemeEditActions.changeThemesLoading(true)
        }, 300)

        listAPI.getThemes(
            group_id,
            folder_id,
            FILTER_REGISTERED,
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationThemeEditActions.changeThemesLoading(false)
            CurationThemeEditActions.setThemes(data)
        }).catch((error) => {
            clearTimeout(loader)
            CurationThemeEditActions.changeThemesLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadSearchThemes = (search) => {
        const {
            group_id,
            folder_id,
        } = this.props.selected

        listAPI.getThemes(
            group_id,
            folder_id,
            FILTER_REGISTERED,
            search
        ).then(({ data }) => {
            CurationThemeEditActions.changeCheckSearch(CHECK_SUCCESS)
            CurationThemeEditActions.setSearchThemes(data)
        }).catch((error) => {
            CurationThemeEditActions.changeCheckSearch(CHECK_NONE)
            PopupActions.showResponseError(error)
        })
    }

    handleChangeSearch = (value) => {
        CurationThemeEditActions.changeSearch(value)
    }

    handleCheckSearch = (value) => {
        this.loadSearchThemes(value)
    }

    handleChangeStatusSearch = (status) => {
        CurationThemeEditActions.changeCheckSearch(status)
    }


    handleSelectedGroup = (item) => {
        CurationThemeEditActions.selectGroup(item)
        if (item.view_type === VIEW_TYPE_LIST) {
            const { folder_id } = this.props.selected
            this.loadThemes(item.id, folder_id)
        }
        else {
            this.loadFolders(item.id)
        }
    }

    handleSelectedFolder = (item) => {
        const { group_id } = this.props.selected
        CurationThemeEditActions.selectFolder(item)
        this.loadThemes(group_id, item.id)
    }

    handleOnOutClickTheme = () => {
        CurationThemeEditActions.unselectTheme()
    }

    handleSelectTheme = (item) => {
        CurationThemeEditActions.selectTheme(item)
    }

    handleOnMenuShowTheme = (item) => {
        CurationThemeEditActions.selectTheme(item)
    }

    handleSortEndTheme = (result) => {
        CurationThemeEditActions.changeThemeOrder(result)
    }

    isValidSave = () => {
        const {
            enable_save,
            search,
        } = this.props

        if (!enable_save) {
            if (search.status === CHECK_SUCCESS) {
                PopupActions.showMessage("테마를 검색중입니다.")
            }
            return false
        }

        return true
    }

    handleSaveTheme = () => {
        if (
            this.props.edit_loading ||
            !this.isValidSave()
        ) return;

        PopupActions.show({
            content: "배경화면 순서를 변경 하시겠습니까?",
            oneBtn: false,
            onConfirm: this.handleSaveConfirm,
        })
    }

    handleSaveConfirm = () => {
        const loader = setTimeout(() => {
            CurationThemeEditActions.changeEditLoading(true)
        }, 300)

        const {
            selected: { group_id, folder_id },
            origin_themes,
            themes
        } = this.props

        listAPI.updateThemeListOrder(
            origin_themes,
            themes
        ).then(() => {
            clearTimeout(loader)
            FrameListActions.changeEditLoading(false)
            this.loadThemes(group_id, folder_id)
        }).catch((error) => {
            clearTimeout(loader)
            FrameListActions.changeEditLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    isValidDelete = () => {
        const {
            enable_delete
        } = this.props

        if (!enable_delete) {
            return false
        }

        return true
    }

    handleDeleteTheme = () => {
        if (
            this.props.edit_loading ||
            !this.isValidDelete()
        ) return;

        PopupActions.show({
            content: "배경화면을 제거 하시겠습니까?",
            oneBtn: false,
            onConfirm: this.handleDeleteConfirm,
        })
    }

    handleDeleteConfirm = () => {
        const loader = setTimeout(() => {
            CurationThemeEditActions.changeEditLoading(true)
        }, 300)

        const { group_id, folder_id, theme } = this.props.selected
        listAPI.deleteThemeList(
            theme.id
        ).then(({ status }) => {
            clearTimeout(loader)
            CurationThemeEditActions.changeEditLoading(false)
            this.loadThemes(group_id, folder_id)
            if (status === 200) {
                PopupActions.showMessage("테마를 삭제했습니다")
            }
            else if (status === 204) {
                PopupActions.showMessage("테마를 찾을수 없습니다")
            }
        }).catch((error) => {
            clearTimeout(loader)
            CurationThemeEditActions.changeEditLoading(false)
            const r = error.response
            if (r && r.status === 400)
                this.loadThemes(group_id, folder_id)
            PopupActions.showResponseError(error)
        })
    }

    componentDidMount() {
        this.loadGroups()
    }

    componentWillUnmount() {
        CurationThemeEditActions.clearPage()
    }

    render() {
        const {
            enable_search,
            enable_save,
            themes_loading,
            groups_loading,
            folders_loading,
            edit_loading,
            theme_draggable,
            search,
            selected: { group_id, folder_id, theme_id },
            groups,
            folders,
            themes
        } = this.props
        return (
            <CurationThemeEditTemplate
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
                        enable_menu={true}
                        enable_menu_update={false}
                        loading={themes_loading}
                        items={themes}
                        selected={theme_id}
                        show_filter={false}
                        draggable={theme_draggable}
                        onOutClick={this.handleOnOutClickTheme}
                        onClick={this.handleSelectTheme}
                        onMenuShow={this.handleOnMenuShowTheme}
                        onDelete={this.handleDeleteTheme}
                        onSortEnd={this.handleSortEndTheme} />
                }
                saveBtn={
                    <Button
                        enable={enable_save}
                        loading={edit_loading}
                        icon={{
                            enable: "/icon/ic_save_enable.svg",
                            disable: "/icon/ic_save_disable.svg"
                        }}
                        onClick={this.handleSaveTheme}>저장하기</Button>
                } />
        )
    }
}

export default connect(
    ({ curationThemeEdit }) => {
        const { group, folder, theme } = curationThemeEdit.selected
        const { search, origin_themes, themes } = curationThemeEdit
        const enable_search = (
            (group !== null && group.view_type === VIEW_TYPE_LIST) ||
            folder !== null
        )
        const themes_loading = (
            curationThemeEdit.themes_loading ||
            search.status === CHECK_LOADING
        )
        const is_searching = search.status === CHECK_SUCCESS
        var theme_draggable = true
        var display_themes = themes
        if (is_searching) {
            theme_draggable = false
            display_themes = search.themes
        }

        const enable_delete = theme !== null

        var enable_save = false
        if (!is_searching) {
            if (themes !== null && origin_themes !== null) {
                for (let i = 0; i < origin_themes.size; i++) {
                    if (origin_themes.get(i).order !== themes.get(i).order) {
                        enable_save = true
                        break;
                    }
                }
            }
        }

        return {
            enable_search: enable_search,
            enable_save: enable_save,
            enable_delete: enable_delete,
            themes_loading: themes_loading,
            groups_loading: curationThemeEdit.groups_loading,
            folders_loading: curationThemeEdit.folders_loading,
            edit_loading: curationThemeEdit.edit_loading,
            theme_draggable: theme_draggable,
            search: curationThemeEdit.search,
            selected: curationThemeEdit.selected,
            groups: curationThemeEdit.groups,
            folders: curationThemeEdit.folders,
            origin_themes: curationThemeEdit.origin_themes,
            themes: display_themes,
        }
    }
)(CurationThemeEditPage);