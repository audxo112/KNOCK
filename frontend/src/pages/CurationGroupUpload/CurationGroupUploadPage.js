import React, { Component } from "react";
import { connect } from "react-redux";
import CurationGroupUploadTemplate from "./CurationGroupUploadTemplate"

import { CurationGroupUploadActions } from "store/actionCreators";
import { CurationList, GroupViewType } from "components/Curation";
import DatePeriod from "components/DatePeriod";
import TextInput from "components/TextInput";
import Button from "components/Button";

import { PopupActions } from "store/actionCreators"

import { curationAPI } from "api";

class CurationGroupUploadPage extends Component {
    loadGroups = (refresh = false) => {
        const loader = setTimeout(() => {
            CurationGroupUploadActions.changeGroupsLoading(true)
        }, 300)

        curationAPI.getGroups(
            true
        ).then(({ data }) => {
            clearTimeout(loader)
            CurationGroupUploadActions.changeGroupsLoading(false)
            if (refresh)
                CurationGroupUploadActions.refreshGroups(data.items)
            else
                CurationGroupUploadActions.setGroups(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            CurationGroupUploadActions.changeGroupsLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleChangeTitle = (title) => {
        CurationGroupUploadActions.changeTitle(title)
    }

    handleStartDateChange = (value) => {
        CurationGroupUploadActions.changePostStartDateTime(value)
    }

    handleEndDateChange = (value) => {
        CurationGroupUploadActions.changePostEndDateTime(value)
    }

    handleChangeViewType = (viewType) => {
        CurationGroupUploadActions.changeViewType(viewType)
    }

    handleOnMove = (result) => {
        CurationGroupUploadActions.changeGroupOrder(result)
    }

    isValidUpload = () => {
        const {
            title,
            post_start_date,
            post_end_date,
            view_type,
            enable_upload,
        } = this.props

        if (!enable_upload) {
            if (title === "") {
                PopupActions.showMessage("제목을 정해주세요")
            }
            else if (post_start_date > post_end_date) {
                PopupActions.showMessage("시작일이 종료일보다 큽니다.")
            }
            else if (view_type === null) {
                PopupActions.showMessage("뷰를 정해주세요")
            }
            return false
        }
        return true
    }

    handleUploadGroup = () => {
        if (!this.isValidUpload()) {
            return;
        }

        const {
            origin_groups,
            groups,
            group,
        } = this.props

        CurationGroupUploadActions.changeUploadLoading(true)
        curationAPI.uploadGroup(
            origin_groups,
            groups,
            group,
        ).then(() => {
            CurationGroupUploadActions.changeUploadLoading(false)
            CurationGroupUploadActions.clearForm()
            this.loadGroups()
            PopupActions.showMessage("업로드가 완료됐습니다.")
        }).catch((error) => {
            CurationGroupUploadActions.changeUploadLoading(false)
            PopupActions.showResponseError(error)
            if (error.response && error.response.status === 400)
                this.loadGroups(true)
        })
    }

    componentDidMount() {
        this.loadGroups()
    }

    componentWillUnmount() {
        CurationGroupUploadActions.clearPage()
    }

    render() {
        const {
            enable_upload,
            groups_loading,
            upload_loading,
            groups,
            group
        } = this.props

        return <>
            <CurationGroupUploadTemplate
                orderList={
                    <CurationList
                        loading_groups={groups_loading}
                        draggable_group={true}
                        groups={groups}
                        onMoveGroup={this.handleOnMove} />
                }
                titleInput={
                    <TextInput
                        label="제목"
                        value={group.title}
                        maxLength={12}
                        showRemainText={true}
                        placeholder="제목을 입력하세요"
                        onChange={this.handleChangeTitle} />
                }
                postDate={
                    <DatePeriod
                        label="게시기간"
                        startDateValue={group.post_start_datetime}
                        endDateValue={group.post_end_datetime}
                        onStartChange={this.handleStartDateChange}
                        onEndChange={this.handleEndDateChange} />
                }
                viewType={
                    <GroupViewType
                        label="뷰"
                        value={group.view_type}
                        onSelect={this.handleChangeViewType} />
                }
                uploadBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_group_upload_enable.svg",
                            disable: "/icon/ic_group_upload_disable.svg"
                        }}
                        enable={enable_upload}
                        loading={upload_loading}
                        onClick={this.handleUploadGroup}>그룹 추가</Button>} />
        </>
    }
}

export default connect(
    ({ curationGroupUpload }) => {
        const { group } = curationGroupUpload
        const enable_upload =
            group.title !== "" &&
            group.post_start_datetime !== "" &&
            group.post_end_datetime !== "" &&
            group.post_start_datetime < group.post_end_datetime &&
            group.view_type !== null;

        return {
            enable_upload: enable_upload,
            groups_loading: curationGroupUpload.groups_loading,
            upload_loading: curationGroupUpload.upload_loading,
            origin_groups: curationGroupUpload.origin_groups,
            groups: curationGroupUpload.groups,
            group: curationGroupUpload.group,
            current_index: curationGroupUpload.current_index,
        }
    }
)(CurationGroupUploadPage);