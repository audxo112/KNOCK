import React, { Component } from "react";
import { connect } from "react-redux";
import EditorUserEditTemplate from "./EditorUserEditTemplate"

import { UserList } from "components/User"
import ContentView from "components/ContentView"
import Switch from "components/Switch"

import CheckableTextInput, {
    CHECK_SUCCESS, CHECK_FAILED, CHECK_NONE
} from "components/CheckableTextInput"
import Button from "components/Button"

import {
    EditorUserEditActions,
    PopupActions
} from "store/actionCreators"

import { editorUserAPI } from "api";
import TextView from "components/TextView";


class EditorUserEditPage extends Component {
    avatarRef = React.createRef()

    loadUsers = () => {
        const loader = setTimeout(() => {
            EditorUserEditActions.changeUsersLoading(true)
        }, 300)

        editorUserAPI.getUsers(
        ).then(({ data }) => {
            clearTimeout(loader)
            EditorUserEditActions.changeUsersLoading(false)
            EditorUserEditActions.setUsers(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserEditActions.changeUsersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleChangeNickname = (value) => {
        EditorUserEditActions.changeNickname(value)
    }

    handleCheckNickname = (value) => {
        const { origin_users, selected: { user_index } } = this.props
        const origin = origin_users.get(user_index)
        if (origin.nickname === value) {
            EditorUserEditActions.changeCheckNickname({
                status: CHECK_NONE
            })
            return;
        }

        editorUserAPI.checkNickname(
            value
        ).then(({ data }) => {
            if (data) {
                EditorUserEditActions.changeCheckNickname({
                    status: CHECK_FAILED,
                    message: data.message,
                })
            }
            else {
                EditorUserEditActions.changeCheckNickname({
                    status: CHECK_SUCCESS
                })
            }
        }).catch((error) => {
            EditorUserEditActions.changeCheckNickname({
                status: CHECK_NONE
            })
            PopupActions.showResponseError(error)
        })
    }

    handleChangeStatusNickname = (status, message = "") => {
        EditorUserEditActions.changeCheckNickname({ status, message })
    }

    handleChangeVisibility = (visibility) => {
        EditorUserEditActions.changeVisibility(visibility)
    }

    _captureImage = (image) => {
        if (!image) return

        const defaultImage = image.capture("jpg", 360, 360)
        const miniImage = image.capture("jpg", 180, 180)
        const microImage = image.capture("jpg", 90, 90)

        return {
            defaultImage: defaultImage,
            miniImage: miniImage,
            microImage: microImage,
        }
    }

    handleAvatarOnLoadFiles = (lists) => {
        EditorUserEditActions.loadAvatar(lists)
    }

    handleAvatarOnLoaded = (color) => {
        const { image_loaded } = this.props
        if (image_loaded) return;

        const image = this._captureImage(
            this.avatarRef.current
        )

        EditorUserEditActions.changeDominantColor(color)
        EditorUserEditActions.setAvatars(image)
    }

    handleAvatarOnClear = () => {
        EditorUserEditActions.clearAvatar()
    }

    handleSelectUser = (user) => {
        EditorUserEditActions.selectUser(user)
    }

    isValidUpdate = () => {
        const {
            enable_update,
            selected: {
                user_index,
                user
            },
            origin_users
        } = this.props

        if (!enable_update) {
            const origin = origin_users.get(user_index)

            if (user.nickname === "") {
                PopupActions.showMessage("이름을 정해주세요")
                return false
            }

            if (user.nickname_status === CHECK_FAILED) {
                PopupActions.showMessage("사용할 수 없는 이름입니다.")
                return false
            }

            if (user.default_avatar.image === "") {
                PopupActions.showMessage("아바타를 정해주세요")
                return false
            }

            if (user.nickname === origin.nickname &&
                user.default_avatar.image === origin.default_avatar.image) {
                PopupActions.showMessage("변경사항이 없습니다.")
                return false
            }

            return false
        }

        return true
    }

    handleUpdateUser = () => {
        if (this.props.edit_loading ||
            !this.isValidUpdate())
            return;

        PopupActions.show({
            content: "정말로 수정하시겠습니까?",
            oneBtn: false,
            onConfirm: this.handleUpdateConfirm,
        })
    }

    handleUpdateConfirm = () => {
        const {
            selected: {
                user_index,
                user
            },
            origin_users
        } = this.props
        const origin = origin_users.get(user_index)

        const loader = setTimeout(() => {
            EditorUserEditActions.changeEditLoading(true)
        }, 300)

        editorUserAPI.updateUser(
            origin,
            user
        ).then(({ status }) => {
            clearTimeout(loader)
            EditorUserEditActions.changeEditLoading(false)
            EditorUserEditActions.clearForm()
            this.loadUsers()
            if (status === 200) {
                PopupActions.showMessage("유저를 수정했습니다.")
            }
            else if (status === 204) {
                PopupActions.showMessage("유저를 찾을수 없습니다.")
            }
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserEditActions.changeEditLoading(false)
            if (error.response) {
                const r = error.response
                if (r.data && r.data.nickname) {
                    const msg = r.data.nickname[0]
                    PopupActions.showMessage(msg)
                }
                else if (r.status && r.status === 400) {
                    this.loadUsers()
                }
            }
            PopupActions.showResponseError(error)
        })
    }

    componentDidMount() {
        this.loadUsers()
    }

    componentWillUnmount() {
        EditorUserEditActions.clearPage()
    }

    render() {
        const {
            users_loading,
            edit_loading,
            users,
            selected: { user },
            enable_edit,
            enable_update,
            avatar,
        } = this.props

        return (
            <EditorUserEditTemplate
                userList={
                    <UserList
                        loading={users_loading}
                        users={users}
                        selected={user}
                        onSelect={this.handleSelectUser} />
                }
                nicknameInput={
                    <CheckableTextInput
                        enable={enable_edit}
                        label="이름"
                        value={user.nickname}
                        placeholder="이름을 입력하세요"
                        replace={true}
                        minLength={2}
                        maxLength={16}
                        showRemainText={true}
                        status_check={user.nickname_status}
                        message={user.nickname_message}
                        onChange={this.handleChangeNickname}
                        onCheck={this.handleCheckNickname}
                        onChangeStatus={this.handleChangeStatusNickname} />
                }
                visibilityUser={
                    <Switch
                        enable={enable_edit}
                        label="계정 숨김"
                        value={user.is_visibility}
                        onChange={this.handleChangeVisibility} />
                }
                emailText={
                    <TextView
                        enable={enable_edit}
                        label="이메일"
                        value={user.email} />
                }
                profileImage={
                    <ContentView
                        ref={this.avatarRef}
                        enable={enable_edit}
                        label="프로필 사진"
                        contentStyle={{
                            width: "240px",
                            height: "240px",
                        }}
                        labelStyle={{
                            fontSize: "16px"
                        }}
                        value={avatar}
                        default_value="/icon/ic_insert_photo.svg"
                        contentType="image"
                        enableColorThief={true}
                        onLoadFiles={this.handleAvatarOnLoadFiles}
                        onLoadedContent={this.handleAvatarOnLoaded}
                        onClear={this.handleAvatarOnClear} />
                }
                updateBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_edit_enable.svg",
                            disable: "/icon/ic_edit_disable.svg",
                        }}
                        enable={enable_update}
                        loading={edit_loading}
                        onClick={this.handleUpdateUser}>수정하기</Button>
                } />
        )
    }
}

export default connect(
    ({ editorUserEdit }) => {
        const {
            selected: {
                user_index,
                user
            },
            origin_users
        } = editorUserEdit

        const is_selected = user_index !== -1
        const origin = is_selected ? origin_users.get(user_index) : null

        const valid_nickname = user.nickname !== ""
        const update_nickname = (
            valid_nickname &&
            origin !== null &&
            user.nickname !== origin.nickname && (
                user.nickname_status === CHECK_SUCCESS ||
                user.nickname_status === CHECK_NONE
            )
        )

        const valid_avatar = (
            user.origin_avatar.file !== null &&
            user.default_avatar.file !== null &&
            user.mini_avatar.file !== null &&
            user.micro_avatar.file !== null
        )

        const update_visibility = (
            origin !== null &&
            user.is_visibility !== origin.is_visibility
        )

        const update_avatar = (
            valid_avatar &&
            origin !== null &&
            user.origin_avatar.image !== origin.origin_avatar.image
        )

        const enable_edit = is_selected
        const enable_update = (
            update_nickname ||
            update_visibility ||
            update_avatar
        )

        const getImage = (resource) => {
            if (resource && resource.image !== null && resource.image !== "") {
                const image = resource.image
                const imageChecker = image.split("base64").length
                if (imageChecker > 1) return image
                else if (imageChecker === 1) return `${image}?${resource.updated}`
            }
            return ""
        }

        var avatar_image = getImage(user.default_avatar)
        if (avatar_image === "") {
            avatar_image = getImage(user.origin_avatar)
        }

        return {
            users_loading: editorUserEdit.users_loading,
            edit_loading: editorUserEdit.edit_loading,
            origin_users: editorUserEdit.origin_users,
            image_loaded: editorUserEdit.image_loaded,
            users: editorUserEdit.users,
            selected: editorUserEdit.selected,
            enable_edit: enable_edit,
            enable_update: enable_update,
            avatar: avatar_image,
        }
    }
)(EditorUserEditPage);