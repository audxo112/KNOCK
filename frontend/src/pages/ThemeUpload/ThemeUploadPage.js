import React, { Component } from "react";
import { connect } from "react-redux";
import ThemeUploadTemplate from "./ThemeUploadTemplate"

import Button from "components/Button"
import { UserSelector } from "components/User"
import TextInput from "components/TextInput";
import SuggestTextInput from "components/SuggestTextInput";
import DatePeriod from "components/DatePeriod"
import Tag from "components/Tag"
import ContentView from "components/ContentView";
import { CurationSelector } from "components/Curation";

import {
    ThemeUploadActions,
    PopupActions
} from "store/actionCreators"

import { themeAPI, editorUserAPI, curationAPI } from "api";


class ThemeUploadPage extends Component {
    normalContentRef = React.createRef()
    largeContentRef = React.createRef()

    loadUsers = () => {
        const loader = setTimeout(() => {
            ThemeUploadActions.changeUsersLoading(true)
        }, 300)

        editorUserAPI.getUsers(
        ).then(({ data }) => {
            clearTimeout(loader)
            ThemeUploadActions.changeUsersLoading(false)
            ThemeUploadActions.setUsers(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            ThemeUploadActions.changeUsersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadRecentLinks = () => {
        themeAPI.getRecentLinks(
        ).then(({ data }) => {
            ThemeUploadActions.setRecentLinks(data.items)
        }).catch((error) => {
            PopupActions.showResponseError(error)
        })
    }

    loadCurations = () => {
        const loader = setTimeout(() => {
            ThemeUploadActions.changeCurationsLoading(true)
        }, 300)

        curationAPI.getCurations(
        ).then(({ data }) => {
            clearTimeout(loader)
            ThemeUploadActions.changeCurationsLoading(false)
            ThemeUploadActions.setCurations(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            ThemeUploadActions.changeCurationsLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    _captureImage = (image, width, height, multi = true) => {
        if (!image) return

        const originImage = image.capture("jpg", width, height)
        if (!multi)
            return originImage

        const defaultImage = image.capture("jpg", 360)
        const miniImage = image.capture("jpg", 100)

        return {
            originImage: originImage,
            defaultImage: defaultImage,
            miniImage: miniImage,
        }
    }

    handleContentOnLoadFiles = (list) => {
        ThemeUploadActions.loadContent(list)
    }

    handleLargeOnLoaded = () => {
        const {
            large_content
        } = this.props.theme

        if (large_content.content === "") return

        const image = this._captureImage(
            this.largeContentRef.current,
            large_content.width,
            large_content.height
        )

        ThemeUploadActions.setLargePreload(image)
    }

    handleNormalOnLoaded = () => {
        const {
            normal_content,
            large_content,
        } = this.props.theme

        if (normal_content.content === "") {
            return
        }

        const image = this._captureImage(
            this.normalContentRef.current,
            normal_content.width,
            normal_content.height
        )

        ThemeUploadActions.setNormalPreload(image.originImage)

        if (large_content.content === "") {

            ThemeUploadActions.setThumbnail(image)
        }
    }

    handleLargeOnClear = () => {
        const {
            normal_content,
        } = this.props.theme

        ThemeUploadActions.clearLargeContent()

        if (normal_content.content !== "") {
            const image = this._captureImage(
                this.normalContentRef.current,
                normal_content.width,
                normal_content.height
            )
            ThemeUploadActions.setThumbnail(image)
        }
        else {
            ThemeUploadActions.clearThumbnail()
        }
    }

    handleNormalOnClear = () => {
        const {
            large_content
        } = this.props.theme

        ThemeUploadActions.clearNormalContent()

        if (large_content.content === "") {
            ThemeUploadActions.clearThumbnail()
        }
    }

    handleThumbnailOnLoaded = (color) => {
        ThemeUploadActions.changeDominantColor(color)
    }

    handleCaputreContent = () => {
        const {
            large_content,
            normal_content,
        } = this.props.theme

        if (large_content.content !== "") {
            const image = this._captureImage(
                this.largeContentRef.current,
                large_content.width,
                large_content.height
            )
            ThemeUploadActions.setThumbnail(image)
        }
        else if (normal_content.content !== "") {
            const image = this._captureImage(
                this.normalContentRef.current,
                normal_content.width,
                normal_content.height
            )
            ThemeUploadActions.setThumbnail(image)
        }
        else {
            PopupActions.showMessage("테마를 등록해주세요")
        }
    }

    isValidUpload = () => {
        const {
            enable_upload,
            theme
        } = this.props

        if (!enable_upload) {
            if (theme.user === null) {
                PopupActions.showMessage("계정을 선택해주세요")
            }
            else if (theme.title === "") {
                PopupActions.showMessage("제목을 정해주세요")
            }
            else if (
                theme.link !== "" && (
                    theme.link.indexOf("http://") === -1 ||
                    theme.link.indexOf("https://") === -1)
            ) {
                PopupActions.showMessage("http:// 나 https:// 를 붙여주세요 ")
            }
            else if (
                theme.large_content.content_file === null &&
                theme.normal_content.content.file === null) {
                PopupActions.showMessage("테마를 등록해주세요")
            }
            else if (
                theme.normal_content.content.file !== null &&
                theme.normal_content.preload_file === null) {
                PopupActions.showMessage("일반 프리로드 이미지를 찾을수 없습니다.\n다시 테마를 등록해주세요")
            }
            else if (
                theme.large_content.content_file === null &&
                theme.large_content.preload_file === null) {
                PopupActions.showMessage("큰 프리로드 이미지를 찾을수 없습니다.\n다시 테마를 등록해주세요")
            }
            else if (
                theme.origin_thumbnail.file === null ||
                theme.default_thumbnail.file === null ||
                theme.mini_thumbnail.file === null) {
                PopupActions.showMessage("썸네일을 다시 선택해주세요")
            }
            else if (theme.post_start > theme.post_end) {
                PopupActions.showMessage("시작일이 종료일보다 작게 설정해주세요")
            }

            return false;
        }

        return true
    }

    handleUploadTheme = () => {
        if (
            this.props.upload_loading ||
            !this.isValidUpload()
        ) return;

        const loader = setTimeout(() => {
            ThemeUploadActions.changeUploadLoading(true)
        }, 300)

        const { theme } = this.props
        themeAPI.uploadTheme(
            theme
        ).then(() => {
            clearTimeout(loader)
            ThemeUploadActions.changeUploadLoading(false)
            ThemeUploadActions.clearForm()

            PopupActions.showMessage("업로드가 완료됐습니다.")
        }).catch((error) => {
            clearTimeout(loader)
            ThemeUploadActions.changeUploadLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleTitleOnChange = (value) => {
        ThemeUploadActions.changeTitle(value)
    }

    handleLinkOnChange = (value) => {
        ThemeUploadActions.changeLink(value)
    }

    handleLinkOnSelected = (item) => {
        ThemeUploadActions.changeLink(item)
    }

    handleUserOnSelected = (item) => {
        ThemeUploadActions.selectUser(item)
    }

    handleTagOnCreate = (tag) => {
        ThemeUploadActions.createTag(tag)
    }

    handleTagOnDelete = (tag) => {
        ThemeUploadActions.deleteTag(tag)
    }

    handleTagOnChange = (tag) => {
        ThemeUploadActions.changeTag(tag)
    }

    handleGroupOnSelected = (group) => {
        ThemeUploadActions.selectGroup(group)
    }

    handleFolderOnSelected = (folder) => {
        ThemeUploadActions.selectFolder(folder)
    }

    handleStartDateChange = (value) => {
        ThemeUploadActions.changePostStart(value)
    }

    handleEndDateChange = (value) => {
        ThemeUploadActions.changePostEnd(value)
    }

    componentDidMount() {
        this.loadUsers()
        this.loadRecentLinks()
        this.loadCurations()
    }

    componentWillUnmount() {
        ThemeUploadActions.clearPage()
    }

    render() {
        const {
            upload_loading,
            enable_upload,
            enable_capture,
            users,
            theme,
            tag,
            recent_links,
            curations,
        } = this.props

        return (
            <ThemeUploadTemplate
                uploadBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_upload_enable.svg",
                            disable: "/icon/ic_upload_disable.svg"
                        }}
                        enable={enable_upload}
                        loading={upload_loading}
                        onClick={this.handleUploadTheme}>배경화면 업로드</Button>
                }
                userSelector={
                    <UserSelector
                        label="계정"
                        placeholder="계정을 선택하세요"
                        items={users}
                        value={theme.user}
                        onSelected={this.handleUserOnSelected} />}
                titleInput={
                    <TextInput
                        label="제목"
                        placeholder="제목을 입력하세요"
                        value={theme.title}
                        onChange={this.handleTitleOnChange} />}
                tagInput={
                    <Tag
                        label="태그"
                        placeholder="태그를 입력하고 엔터를 눌러주세요"
                        value={tag}
                        tags={theme.tags}
                        onCreate={this.handleTagOnCreate}
                        onChange={this.handleTagOnChange}
                        onDelete={this.handleTagOnDelete} />}
                linkInput={
                    <SuggestTextInput
                        label="링크"
                        value={theme.link}
                        placeholder="주소를 입력하세요"
                        suggests={recent_links}
                        onChange={this.handleLinkOnChange}
                        onSelected={this.handleLinkOnSelected} />}
                postPeriod={
                    <DatePeriod
                        label="게시기간"
                        startDateValue={theme.post_start}
                        endDateValue={theme.post_end}
                        onStartChange={this.handleStartDateChange}
                        onEndChange={this.handleEndDateChange} />
                }
                curationSelector={
                    <CurationSelector
                        label="카테고리"
                        group={theme.group}
                        folder={theme.folder}
                        curations={curations}
                        onGroupSelected={this.handleGroupOnSelected}
                        onFolderSelected={this.handleFolderOnSelected} />
                }
                thumbnailImage={
                    <ContentView
                        label=" "
                        value={theme.default_thumbnail.image}
                        contentType={theme.default_thumbnail.image_type}
                        allowTypes={["image"]}
                        contentStyle={{
                            width: "240px",
                            height: "493px",
                        }}
                        enableDropDown={false}
                        enableClearBtn={false}
                        enableColorThief={true}
                        onLoadedContent={this.handleThumbnailOnLoaded} />
                }
                captureBtn={
                    <Button
                        btnStyle={{
                            width: "240px",
                            height: "40px",
                            fontSize: "14px"
                        }}
                        enable={enable_capture}
                        onClick={this.handleCaputreContent}>썸네일 선택</Button>
                }
                largeVideo={
                    <ContentView
                        ref={this.largeContentRef}
                        label="720"
                        contentStyle={{
                            width: "240px",
                            height: "493px",
                        }}
                        value={theme.large_content.content}
                        contentType={theme.large_content.content_type}
                        onLoadFiles={this.handleContentOnLoadFiles}
                        onLoadedContent={this.handleLargeOnLoaded}
                        onClear={this.handleLargeOnClear} />
                }
                normalVideo={
                    <ContentView
                        ref={this.normalContentRef}
                        label="raw"
                        contentStyle={{
                            width: "240px",
                            height: "426px",
                        }}
                        value={theme.normal_content.content}
                        contentType={theme.normal_content.content_type}
                        onLoadFiles={this.handleContentOnLoadFiles}
                        onLoadedContent={this.handleNormalOnLoaded}
                        onClear={this.handleNormalOnClear} />
                } />
        )
    }
}

export default connect(
    ({ themeUpload }) => {
        const { theme } = themeUpload

        const valid_link = (
            theme.link === "" ||
            (theme.link !== "" && (
                theme.link.indexOf("http://") === -1 ||
                theme.link.indexOf("https://") === -1)
            )
        )

        const valid_content = (
            (
                theme.large_content.content_file !== null &&
                theme.large_content.preload_file !== null
            ) ||
            (
                theme.normal_content.content.file !== null &&
                theme.normal_content.preload_file !== null
            )
        )

        const valid_thumbnail = (
            theme.origin_thumbnail.file !== null &&
            theme.default_thumbnail.file !== null &&
            theme.mini_thumbnail.file !== null
        )

        const valid_post = theme.post_start <= theme.post_end

        const enable_upload =
            theme.user !== null &&
            theme.title !== "" &&
            valid_link &&
            valid_content &&
            valid_thumbnail &&
            valid_post

        const enable_capture = valid_content

        return {
            users_loading: themeUpload.users_loading,
            upload_loading: themeUpload.upload_loading,
            enable_upload: enable_upload,
            enable_capture: enable_capture,
            users: themeUpload.users,
            tag: themeUpload.tag,
            recent_links: themeUpload.recent_links,
            curations: themeUpload.curations,
            theme: themeUpload.theme,
        }
    }
)(ThemeUploadPage);