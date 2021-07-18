import React, { Component } from "react";
import { connect } from "react-redux";
import EditorUserBanNicknameTemplate from "./EditorUserBanNicknameTemplate"

import CheckableTextInput, {
    CHECK_SUCCESS, CHECK_FAILED, CHECK_LOADING, CHECK_NONE
} from "components/CheckableTextInput"
import Button from "components/Button"
import { BanNicknameList } from "components/User"

import {
    EditorUserBanNicknameActions,
    PopupActions
} from "store/actionCreators"

import { editorUserAPI } from "api";

class EditorUserBanNicknamePage extends Component {
    loadBanNicknames = () => {
        const loader = setTimeout(() => {
            EditorUserBanNicknameActions.changeBanNicknamesLoading(true)
        }, 300)

        editorUserAPI.getBanNicknames(
        ).then(({ data }) => {
            clearTimeout(loader)
            EditorUserBanNicknameActions.changeBanNicknamesLoading(false)
            EditorUserBanNicknameActions.setBanNicknames(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserBanNicknameActions.changeBanNicknamesLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleChangeNickname = (value) => {
        EditorUserBanNicknameActions.changeBanNickname(value)
    }

    handleCheckNickname = (value) => {
        editorUserAPI.checkBanNickname(
            value
        ).then(({ data, status }) => {
            if (status === 200) {
                const exist = data.map(item => item.nickname).join()

                EditorUserBanNicknameActions.changeCheckBanNickname({
                    status: CHECK_FAILED,
                    message: `${exist}가 이미 존재합니다.`
                })
            }
            else if (status === 204) {
                EditorUserBanNicknameActions.changeCheckBanNickname({
                    status: CHECK_SUCCESS
                })
            }
        }).catch((error) => {
            EditorUserBanNicknameActions.changeCheckBanNickname({
                status: CHECK_NONE
            })
            PopupActions.showResponseError(error)
        })
    }

    handleChangeStatusNickname = (status, message = "") => {
        EditorUserBanNicknameActions.changeCheckBanNickname({ status, message })
    }

    handleChangeFilter = (_, value) => {
        EditorUserBanNicknameActions.changeBanNicknameFilter(value)
    }

    isValidUpload = () => {
        const {
            enable_upload,
            ban_nickname,
        } = this.props;

        if (!enable_upload) {
            if (ban_nickname.nickname === "") {
                PopupActions.showMessage("이름을 정해주세요")
            }
            else if (ban_nickname.status === CHECK_FAILED) {
                PopupActions.showMessage("이미 금지된 이름입니다.")
            }
            else if (ban_nickname.status === CHECK_LOADING) {
                PopupActions.showMessage("이름을 검사중입니다.")
            }
            return false
        }
        return true
    }

    handleUpload = () => {
        const {
            upload_loading,
            ban_nickname: { value },
        } = this.props

        if (
            upload_loading ||
            !this.isValidUpload()
        ) return;

        const loader = setTimeout(() => {
            EditorUserBanNicknameActions.changeUploadLoading(true)
        }, 300)

        editorUserAPI.uploadBanNickname(
            value
        ).then(() => {
            clearTimeout(loader)
            EditorUserBanNicknameActions.changeUploadLoading(false)
            EditorUserBanNicknameActions.clearForm()
            this.loadBanNicknames()
            PopupActions.showMessage("업로드가 완료됐습니다.")
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserBanNicknameActions.changeUploadLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleDelete = (item) => {
        PopupActions.show({
            content: `${item.nickname}을 정말로 삭제하시겠습니까?`,
            oneBtn: false,
            confirmData: item,
            onConfirm: this.handleDeleteConfirm,
        })
    }

    handleDeleteConfirm = (item) => {
        const loader = setTimeout(() => {
            EditorUserBanNicknameActions.setDeletingId(item.id)
        }, 300)

        editorUserAPI.deleteBanNickname(
            item.id
        ).then(({ status }) => {
            clearTimeout(loader)
            EditorUserBanNicknameActions.setDeletingId("")
            this.loadBanNicknames()
            if (status === 200)
                PopupActions.showMessage("삭제가 완료 됬습니다.")
            else if (status === 204)
                PopupActions.showMessage("닉네임을 찾을수 없습니다.")
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserBanNicknameActions.setDeletingId("")
            PopupActions.showResponseError(error)
        })
    }

    componentDidMount() {
        this.loadBanNicknames()
    }

    componentWillUnmount() {
        EditorUserBanNicknameActions.clearPage()
    }

    render() {
        const {
            ban_nicknames_loading,
            upload_loading,
            deleting_id,
            enable_upload,
            ban_nickname,
            ban_nicknames,
        } = this.props

        return (
            <EditorUserBanNicknameTemplate
                banNicknameInput={
                    <CheckableTextInput
                        label="이름"
                        name="nickname"
                        value={ban_nickname.value}
                        placeholder="이름을 추가하세요"
                        replace={true}
                        minLength={2}
                        multi={true}
                        status_check={ban_nickname.status}
                        message={ban_nickname.message}
                        onChange={this.handleChangeNickname}
                        onCheck={this.handleCheckNickname}
                        onChangeStatus={this.handleChangeStatusNickname}
                        onEnter={this.handleUpload} />
                }
                uploadBtn={
                    <Button
                        btnStyle={{
                            width: "120px",
                            height: "40px",
                        }}
                        enable={enable_upload}
                        loading={upload_loading}
                        onClick={this.handleUpload}>추가</Button>
                }
                banNicknameList={
                    <BanNicknameList
                        loading={ban_nicknames_loading}
                        deleting_id={deleting_id}
                        header={ban_nicknames.header}
                        items={ban_nicknames.items}
                        filter={ban_nicknames.filter}
                        onDelete={this.handleDelete}
                        onChecked={this.handleChangeFilter} />
                } />
        )
    }
}

export default connect(
    ({ editorUserBanNickname }) => {
        const { ban_nickname: { value, status } } = editorUserBanNickname
        const isEditedBanNickname =
            value !== "" && (
                status === CHECK_SUCCESS
            )

        const enable_upload = isEditedBanNickname

        return {
            ban_nicknames_loading: editorUserBanNickname.ban_nicknames_loading,
            upload_loading: editorUserBanNickname.upload_loading,
            deleting_id: editorUserBanNickname.deleting_id,
            enable_upload: enable_upload,
            ban_nickname: editorUserBanNickname.ban_nickname,
            ban_nicknames: editorUserBanNickname.ban_nicknames,
        }
    }
)(EditorUserBanNicknamePage);

