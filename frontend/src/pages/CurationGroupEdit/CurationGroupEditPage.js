import React, { Component } from "react";
import { connect } from "react-redux";
import CurationGroupEditTemplate from "./CurationGroupEditTemplate"

import { CurationGroupEditActions, PopupActions } from "store/actionCreators";
import DatePeriod from "components/DatePeriod";
import TextInput from "components/TextInput";
import Button from "components/Button";
import { CurationList, GROUP_LIST } from "components/Curation";

import { curationAPI } from "api";

class CurationGroupEditPage extends Component {
    loadGroups = (page, refresh = false) => {
        const loader = setTimeout(() => {
            CurationGroupEditActions.changeGroupsLoading(true)
        }, 300)

        curationAPI.getGroups(
            page === GROUP_LIST
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationGroupEditActions.changeGroupsLoading(false)
            if (refresh)
                CurationGroupEditActions.refreshGroups(data.items)
            else
                CurationGroupEditActions.setGroups(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            CurationGroupEditActions.changeGroupsLoading(false)
            PopupActions.showResponseError(error)
        })
    }


    handleChangeTitle = (title) => {
        CurationGroupEditActions.changeTitle(title)
    }

    handleStartDateChange = (value) => {
        CurationGroupEditActions.changePostStartDateTime(value)
    }

    handleEndDateChange = (value) => {
        CurationGroupEditActions.changePostEndDateTime(value)
    }

    handleMoveGroup = (result) => {
        CurationGroupEditActions.changeGroupOrder(result)
    }

    handleSelectGroup = (group) => {
        CurationGroupEditActions.selectGroup(group)
    }

    handleChangedPage = (page) => {
        CurationGroupEditActions.changePage(page)
        this.loadGroups(page)
    }

    isValidDelete = () => {
        const {
            group_index,
        } = this.props.selected

        if (group_index === null) {
            PopupActions.showMessage("????????? ??????????????????")
            return false
        }

        return true
    }

    handleDeleteGroup = () => {
        if (this.props.edit_loading ||
            !this.isValidDelete())
            return;

        PopupActions.show({
            content: "????????? ?????????????????????????",
            onBtn: false,
            onConfirm: this.handleDeleteConfirm,
        })
    }

    handleDeleteConfirm = () => {
        const {
            current_page,
            selected: { group }
        } = this.props

        CurationGroupEditActions.changeEditLoading(true)
        curationAPI.deleteGroup(
            group.id
        ).then(({ status }) => {
            CurationGroupEditActions.changeEditLoading(false)
            CurationGroupEditActions.clearForm()
            this.loadGroups(current_page)
            if (status === 200) {
                PopupActions.showMessage("????????? ??????????????????")
            }
            else if (status === 204) {
                PopupActions.showMessage("????????? ????????? ????????????")
            }
        }).catch((error) => {
            CurationGroupEditActions.changeEditLoading(false)
            this.loadGroups(current_page, true)
            PopupActions.showResponseError(error)
        })
    }

    isValidUpdate = () => {
        const {
            selected: {
                group_index
            },
            enable_update,
            title,
            post_start_datetime,
            post_end_datetime,
        } = this.props

        if (!enable_update) {
            if (group_index === null) {
                PopupActions.showMessage("????????? ??????????????????")
                return false
            }

            if (title === "") {
                PopupActions.showMessage("????????? ???????????????")
                return false
            }

            if (post_start_datetime > post_end_datetime) {
                PopupActions.showMessage("???????????? ??????????????? ?????????.")
                return false
            }

            PopupActions.showMessage("????????? ????????? ????????????.")
            return false
        }

        return true
    }

    handleUpdateGroup = () => {
        if (
            this.props.edit_loading ||
            !this.isValidUpdate()
        ) return;

        PopupActions.show({
            content: "????????? ?????????????????????????",
            onBtn: false,
            onConfirm: this.handleUpdateConfirm,
        })
    }

    handleUpdateConfirm = () => {
        const {
            current_page,
            origin_groups,
            groups,
            selected: { group, group_index }
        } = this.props

        CurationGroupEditActions.changeEditLoading(true)

        curationAPI.updateGroup(
            origin_groups,
            groups,
            group,
            group_index
        ).then(({ status }) => {
            CurationGroupEditActions.changeEditLoading(false)
            CurationGroupEditActions.clearForm()
            this.loadGroups(current_page)
            if (status === 200) {
                PopupActions.showMessage("????????? ??????????????????.")
            }
            else if (status === 204) {
                PopupActions.showMessage("????????? ????????? ????????????.")
            }
        }).catch((error) => {
            CurationGroupEditActions.changeEditLoading(false)
            this.loadGroups(current_page, true)
            PopupActions.showResponseError(error)
        })
    }

    componentDidMount() {
        this.loadGroups(this.props.current_page)
    }

    componentWillUnmount() {
        CurationGroupEditActions.clearPage()
    }

    render() {
        const {
            enable_delete,
            enable_update,
            enable_edit,
            edit_loading,
            groups_loading,
            groups,
            selected,
            selected_group_id } = this.props

        return <>
            <CurationGroupEditTemplate
                groupList={
                    <CurationList
                        enable_old_groups={true}
                        draggable_group={true}
                        loading_groups={groups_loading}
                        selected_group={selected_group_id}
                        groups={groups}
                        onMoveGroup={this.handleMoveGroup}
                        onSelectedGroup={this.handleSelectGroup}
                        onChangePage={this.handleChangedPage} />
                }
                titleInput={
                    <TextInput
                        label="??????"
                        enable={enable_edit}
                        value={selected.group.title}
                        maxLength={12}
                        showRemainText={true}
                        placeholder="????????? ???????????????"
                        onChange={this.handleChangeTitle} />
                }
                postDate={
                    <DatePeriod
                        label="????????????"
                        enable={enable_edit}
                        startDateValue={selected.group.post_start_datetime}
                        endDateValue={selected.group.post_end_datetime}
                        onStartChange={this.handleStartDateChange}
                        onEndChange={this.handleEndDateChange} />
                }
                deleteBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_delet_enable.svg",
                            disable: "/icon/ic_delet_disable.svg"
                        }}
                        enable={enable_delete}
                        loading={edit_loading}
                        onClick={this.handleDeleteGroup}>?????? ??????</Button>
                }
                updateBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_edit_enable.svg",
                            disable: "/icon/ic_edit_disable.svg",
                        }}
                        enable={enable_update}
                        loading={edit_loading}
                        onClick={this.handleUpdateGroup}>?????? ??????</Button>
                } />
        </>
    }
}

export default connect(
    ({ curationGroupEdit }) => {
        const { selected, groups, origin_groups } = curationGroupEdit

        const enable_delete = selected.group_index !== null;
        const enable_edit = selected.group_index !== null;
        var enable_update = false
        if (groups !== null && origin_groups !== null) {
            origin_groups.forEach((_, index) => {
                if (origin_groups.get(index).order !== groups.get(index).order) {
                    enable_update = true
                    return
                }
            })

            // ????????? ????????? ?????? ?????? ??????
            if (!enable_update && selected.group_index !== null) {
                const group = selected.group
                const origin = origin_groups.find(item => item.id === group.id)

                enable_update =
                    group.title !== "" &&
                    group.post_start_datetime !== "" &&
                    group.post_end_datetime !== "" &&
                    group.post_start_datetime < group.post_end_datetime &&
                    (
                        group.title !== origin.title ||
                        group.post_start_datetime !== origin.post_start_datetime ||
                        group.post_end_datetime !== origin.post_end_datetime
                    )
            }
        }

        return {
            enable_delete: enable_delete,
            enable_update: enable_update,
            enable_edit: enable_edit,
            edit_loading: curationGroupEdit.edit_loading,
            groups_loading: curationGroupEdit.groups_loading,
            origin_groups: curationGroupEdit.origin_groups,
            groups: curationGroupEdit.groups,
            selected: curationGroupEdit.selected,
            selected_group_id: selected.group.id !== "" ? selected.group.id : null,
            current_page: curationGroupEdit.current_page,
        }
    }
)(CurationGroupEditPage);