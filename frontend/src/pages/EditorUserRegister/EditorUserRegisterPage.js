import React, { Component } from "react";
import { connect } from "react-redux";
import EditorUserRegisterTemplate from "./EditorUserRegisterTemplate"

import {
    UserList,
    UserSearch
} from "components/User"
import ContentView from "components/ContentView"
import CheckableTextInput, {
    CHECK_SUCCESS, CHECK_FAILED, CHECK_NONE
} from "components/CheckableTextInput"
import Button from "components/Button"

import {
    EditorUserRegisterActions,
    PopupActions
} from "store/actionCreators";

import { editorUserAPI } from "api";

class EditorUserRegisterPage extends Component {
    avatarRef = React.createRef()

    loadUsers = () => {
        const loader = setTimeout(() => {
            EditorUserRegisterActions.changeUsersLoading(true)
        }, 300)

        editorUserAPI.getUsers(
        ).then(({ data }) => {
            clearTimeout(loader)
            EditorUserRegisterActions.changeUsersLoading(false)
            EditorUserRegisterActions.setUsers(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserRegisterActions.changeUsersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadSearchUsers = (search) => {
        const loader = setTimeout(() => {
            EditorUserRegisterActions.changeSearchLoading(true)
        }, 300)

        editorUserAPI.searchUser(
            search
        ).then(({ data }) => {
            clearTimeout(loader)
            EditorUserRegisterActions.changeSearchLoading(false)
            EditorUserRegisterActions.setSearchUsers(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserRegisterActions.changeSearchLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleChangeNickname = (value) => {
        EditorUserRegisterActions.changeNickname(value)
    }

    handleCheckNickname = (value) => {
        editorUserAPI.checkNickname(
            value
        ).then(({ data }) => {
            if (data) {
                if (data.code === 401) {
                    EditorUserRegisterActions.changeCheckNickname({
                        status: CHECK_FAILED,
                        message: "중복된 이름이 있습니다.",
                    })
                }
                else if (data.code === 402) {
                    EditorUserRegisterActions.changeCheckNickname({
                        status: CHECK_FAILED,
                        message: "금지된 이름입니다.",
                    })
                }
            }
            else {
                EditorUserRegisterActions.changeCheckNickname({
                    status: CHECK_SUCCESS
                })
            }
        }).catch((error) => {
            EditorUserRegisterActions.changeCheckNickname({
                status: CHECK_NONE
            })
            PopupActions.showResponseError(error)
        })
    }

    handleChangeStatusNickname = (status, message = "") => {
        EditorUserRegisterActions.changeCheckNickname({ status, message })
    }

    handleChangeSearchValue = (value) => {
        EditorUserRegisterActions.changeSearchValue(value)
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

    handleAvatarOnLoadFiles = (files) => {
        EditorUserRegisterActions.loadAvatar(files)
    }

    handleAvatarOnLoaded = () => {
        const { image_loaded } = this.props
        if (image_loaded) return;

        const image = this._captureImage(
            this.avatarRef.current
        )

        EditorUserRegisterActions.setAvatars(image)
    }

    handleAvatarOnClear = () => {
        EditorUserRegisterActions.clearAvatar()
    }

    handleSearch = (value) => {
        this.loadSearchUsers(value)
    }

    handleSelectUser = (user) => {
        const { search } = this.props
        const loader = setTimeout(() => {
            EditorUserRegisterActions.setRegisteringId(user.id)
        }, 300)

        editorUserAPI.registerEditor(
            user.id,
            !user.is_usable_editor
        ).then(({ status }) => {
            clearTimeout(loader)
            EditorUserRegisterActions.setRegisteringId("")

            if (status === 200) {
                this.loadUsers()
                this.loadSearchUsers(search.value)
            }
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserRegisterActions.setRegisteringId("")
            PopupActions.showResponseError(error)
        })
    }

    isValidUpload = () => {
        const {
            enable_upload,
            user
        } = this.props;

        if (!enable_upload) {
            if (user.nickname === "") {
                PopupActions.showMessage("이름을 정해주세요")
            }
            else if (user.nickname_status === CHECK_FAILED) {
                PopupActions.showMessage("중복된 이름입니다.")
            }
            else if (
                user.origin_avatar.file === null ||
                user.default_avatar.file === null ||
                user.mini_avatar.file === null ||
                user.micro_avatar.file === null
            ) {
                PopupActions.showMessage("아바타를 정해주세요")
            }

            return false
        }

        return true
    }

    handleUploadUser = () => {
        if (
            this.props.upload_loading ||
            !this.isValidUpload()
        ) return;

        const loader = setTimeout(() => {
            EditorUserRegisterActions.changeUploadLoading(true)
        }, 300)

        const { user } = this.props
        editorUserAPI.registerUser(
            user
        ).then(() => {
            clearTimeout(loader)
            EditorUserRegisterActions.changeUploadLoading(false)
            EditorUserRegisterActions.clearForm()
            this.loadUsers()

            PopupActions.showMessage("업로드가 완료됐습니다.")
        }).catch((error) => {
            clearTimeout(loader)
            EditorUserRegisterActions.changeUploadLoading(false);
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
        EditorUserRegisterActions.clearPage()
    }

    render() {
        const {
            users_loading,
            search_loading,
            upload_loading,
            registering_id,
            enable_upload,
            users,
            user,
            avatar,
            search,
        } = this.props

        return (<EditorUserRegisterTemplate
            userList={
                <UserList
                    loading={users_loading}
                    users={users} />
            }
            nicknameInput={
                <CheckableTextInput
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
            profileImage={
                <ContentView
                    ref={this.avatarRef}
                    label="프로필 사진"
                    labelStyle={{
                        fontSize: "16px"
                    }}
                    contentStyle={{
                        width: "240px",
                        height: "240px",
                    }}
                    value={avatar}
                    default_value="/icon/ic_insert_photo.svg"
                    contentType="image"
                    onLoadFiles={this.handleAvatarOnLoadFiles}
                    onLoadedContent={this.handleAvatarOnLoaded}
                    onClear={this.handleAvatarOnClear} />
            }
            registerBtn={
                <Button
                    icon={{
                        enable: "/icon/ic_account_add_enable.svg",
                        disable: "/icon/ic_account_add_disable.svg"
                    }}
                    enable={enable_upload}
                    loading={upload_loading}
                    onClick={this.handleUploadUser}>등록하기</Button>
            }
            userSearchForm={
                <UserSearch
                    label="계정 검색"
                    value={search.value}
                    minLength={2}
                    maxLength={30}
                    loading={search_loading}
                    registering_id={registering_id}
                    users={search.users}
                    placeholder="이름 또는 메일을 검색하세요"
                    onChange={this.handleChangeSearchValue}
                    onSearch={this.handleSearch}
                    onSelected={this.handleSelectUser} />
            }
        />)
    }
}

export default connect(
    ({ editorUserRegister }) => {
        const { user } = editorUserRegister

        const valid_avatar = (
            user.origin_avatar.file !== null &&
            user.default_avatar.file !== null &&
            user.mini_avatar.file !== null &&
            user.micro_avatar.file !== null
        )

        const enable_upload =
            user.nickname_status === CHECK_SUCCESS &&
            user.nickname !== "" &&
            valid_avatar

        var avatar = user.default_avatar.image
        if (avatar === "") {
            avatar = user.origin_avatar.image
        }

        return {
            users_loading: editorUserRegister.users_loading,
            search_loading: editorUserRegister.search_loading,
            upload_loading: editorUserRegister.upload_loading,
            image_loaded: editorUserRegister.image_loaded,
            registering_id: editorUserRegister.registering_id,
            enable_upload: enable_upload,
            users: editorUserRegister.users,
            user: editorUserRegister.user,
            avatar: avatar,
            search: editorUserRegister.search,
        }
    }
)(EditorUserRegisterPage);