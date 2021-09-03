import React, { Component } from "react"
import { connect } from "react-redux"
import ThemeListTemplate from "./ThemeListTemplate"
import ThemeItemTemplate from "./ThemeItemTemplate"

import TextInput from "components/TextInput"
import ImageButton from "components/ImageButton"
import Button from "components/Button"
import { ThemeList } from "components/Theme"
import { UserSelector } from "components/User"
import SuggestTextInput from "components/SuggestTextInput";
import DatePeriod from "components/DatePeriod"
import Switch from "components/Switch"
import Tag from "components/Tag"
import ContentView from "components/ContentView";


import {
    ThemeListActions,
    PopupActions
} from "store/actionCreators"

import { themeAPI, editorUserAPI } from "api";
import { PAGE_THEME_DETAIL, PAGE_THEME_LIST } from "const/page"

class ThemeListPage extends Component {
    lastElementRef = React.createRef()
    normalContentRef = React.createRef()
    largeContentRef = React.createRef()

    state = {
        page: 1
    }

    loadThemes = () => {
        const loader = setTimeout(() => {
            ThemeListActions.changeThemesLoading(true)
        }, 300)

        const { page } = this.state

        return themeAPI.getThemes(
            page
        ).then(({ data, status }) => {
            clearTimeout(loader)
            ThemeListActions.changeThemesLoading(false)
            if (status === 200) {
                ThemeListActions.appendThemes(data.items)
                this.setState({
                    page: page + 1
                })
            }
        }).catch((error) => {
            clearTimeout(loader)
            ThemeListActions.changeThemesLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadUsers = () => {
        const loader = setTimeout(() => {
            ThemeListActions.changeUsersLoading(true)
        }, 300)

        editorUserAPI.getUsers(
        ).then(({ data }) => {
            clearTimeout(loader)
            ThemeListActions.changeUsersLoading(false)
            ThemeListActions.setUsers(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            ThemeListActions.changeUsersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadRecentLinks = () => {
        themeAPI.getRecentLinks(
        ).then(({ data }) => {
            ThemeListActions.setRecentLinks(data.items)
        }).catch((error) => {
            PopupActions.showResponseError(error)
        })
    }

    isValidUpdate = () => {
        const {
            enable_update,
            theme,
        } = this.props

        if (!enable_update) {
            if (theme.user === null) {
                PopupActions.showMessage("계정을 선택해주세요")
            }
            else if (
                theme.title === "") {
                PopupActions.showMessage("제목을 정해주세요")
            }
            else if (
                theme.link !== "" && (
                    theme.link.indexOf("http://") === -1 ||
                    theme.link.indexOf("https://") === -1)
            ) {
                PopupActions.showMessage("http:// 나 https:// 를 붙여주세요 ")
            }
            else if (theme.post_start > theme.post_end) {
                PopupActions.showMessage("시작일이 종료일보다 작게 설정해주세요")
            }
            else if (
                theme.large_content.content === "" &&
                theme.normal_content.content === ""
            ) {
                PopupActions.showMessage("컨텐츠를 등록해주세요")
            }
            else {
                PopupActions.showMessage("변경된 데이터가 없습니다.")
            }

            return false
        }

        return true
    }

    handleUpdateTheme = () => {
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
        const { origin, theme } = this.props

        const loader = setTimeout(() => {
            ThemeListActions.changeEditLoading(true)
        }, 300)

        themeAPI.updateTheme(
            origin,
            theme,
        ).then(({ data, status }) => {
            clearTimeout(loader)
            ThemeListActions.changeEditLoading(false)
            if (status === 200) {
                ThemeListActions.updateTheme(data.item)
                PopupActions.showMessage("테마를 수정했습니다.")
            }
            else if (status === 204) {
                ThemeListActions.deleteTheme(theme)
                PopupActions.showMessage("존재하지 않는 테마입니다.")
            }
        }).catch((error) => {
            clearTimeout(loader)
            ThemeListActions.changeEditLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    isValidDelete = () => {
        const {
            enable_delete,
            origin
        } = this.props

        if (!enable_delete) {
            if (origin === null) {
                PopupActions.showMessage("선택된 테마가 없습니다.")
            }

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
            content: "정말로 삭제하시겠습니까?",
            oneBtn: false,
            onConfirm: this.handleDeleteConfirm,
        })
    }

    handleDeleteConfirm = () => {
        const loader = setTimeout(() => {
            ThemeListActions.changeEditLoading(true)
        }, 300)

        const { theme } = this.props
        themeAPI.deleteTheme(
            theme
        ).then(({ status, data }) => {
            clearTimeout(loader)
            ThemeListActions.changeEditLoading(false)
            if (status === 200) {
                ThemeListActions.deleteTheme(data.item)
                PopupActions.showMessage("테마를 삭제했습니다.")
            }
            else if (status === 204) {
                PopupActions.showMessage("테마를 찾을수 없습니다.")
            }
        }).catch((error) => {
            clearTimeout(loader)
            ThemeListActions.changeEditLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleCancelShowSearch = () => {
        ThemeListActions.changeShowSearch(false)
    }

    digitToHex = (val) => {
        return ("00" + val.toString(16)).substr(-2).toUpperCase();
    }

    arrToColor = (arr) => {
        return `#${this.digitToHex(arr[0])}${this.digitToHex(arr[1])}${this.digitToHex(arr[2])}`
    }

    handleShowSearch = () => {
        ThemeListActions.changeShowSearch(true)
    }

    handleChangeSearch = (value) => {
        ThemeListActions.changeSearch(value)
    }

    handleOnOutClickTheme = () => {
        ThemeListActions.unselectTheme()
    }

    handleClickTheme = (theme) => {
        ThemeListActions.selectTheme(theme)
    }

    handleDoubleClickTheme = () => {
        ThemeListActions.changePage(PAGE_THEME_DETAIL)
    }

    handleOnMenuShowTheme = (theme) => {
        ThemeListActions.selectTheme(theme)
    }

    handleGotoUpdateTheme = (theme) => {
        ThemeListActions.selectTheme(theme)
        ThemeListActions.changePage(PAGE_THEME_DETAIL)
    }

    handleGotoDeleteTheme = (theme) => {
        ThemeListActions.selectTheme(theme)
        this.handleDeleteTheme(theme)
    }

    handleClickBack = () => {
        ThemeListActions.changePage(PAGE_THEME_LIST)
    }

    handleUserOnSelected = (item) => {
        ThemeListActions.selectUser(item)
    }

    handleTitleOnChange = (value) => {
        ThemeListActions.changeTitle(value)
    }

    handleTagOnCreate = (tag) => {
        ThemeListActions.createTag(tag)
    }

    handleTagOnDelete = (tag) => {
        ThemeListActions.deleteTag(tag)
    }

    handleTagOnChange = (tag) => {
        ThemeListActions.changeTag(tag)
    }

    handleLinkOnChange = (value) => {
        ThemeListActions.changeLink(value)
    }

    handleLinkOnSelected = (item) => {
        ThemeListActions.changeLink(item)
    }

    handleStartDateChange = (value) => {
        ThemeListActions.changePostStart(value)
    }

    handleEndDateChange = (value) => {
        ThemeListActions.changePostEnd(value)
    }

    handleAllowDownloadChange = (value) => {
        ThemeListActions.changeAllowDownload(value)
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
        ThemeListActions.loadContent(list)
    }

    handleLargeOnLoaded = () => {
        const {
            loaded_large_content,
            theme: { large_content }
        } = this.props

        if (!loaded_large_content) {
            ThemeListActions.changeLoadedLargeContent(true)
            return
        }

        if (large_content.content === "") {
            return
        }

        const image = this._captureImage(
            this.largeContentRef.current,
            large_content.width,
            large_content.height
        )

        ThemeListActions.setLargePreload(image)
    }

    handleNormalOnLoaded = () => {
        const {
            loaded_normal_content,
            theme: {
                normal_content,
                large_content,
            }
        } = this.props

        if (!loaded_normal_content) {
            ThemeListActions.changeLoadedNormalContent(true)
            return
        }

        if (normal_content.content === "") {
            return
        }

        const image = this._captureImage(
            this.normalContentRef.current,
            normal_content.width,
            normal_content.height
        )

        ThemeListActions.setNormalPreload(image.originImage)

        if (large_content.content === "") {
            ThemeListActions.setThumbnail(image)
        }
    }

    handleLargeOnClear = () => {
        const {
            normal_content,
        } = this.props.theme

        ThemeListActions.clearLargeContent()

        if (normal_content.content !== "") {
            const image = this._captureImage(
                this.normalContentRef.current,
                normal_content.width,
                normal_content.height
            )
            ThemeListActions.setThumbnail(image)
        }
        else {
            ThemeListActions.clearThumbnail()
        }
    }

    handleNormalOnClear = () => {
        const {
            large_content
        } = this.props.theme

        ThemeListActions.clearNormalContent()

        if (large_content.content === "") {
            ThemeListActions.clearThumbnail()
        }
    }

    handleThumbnailOnLoaded = (color) => {
        ThemeListActions.changeDominantColor(color)
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
            ThemeListActions.setThumbnail(image)
        }
        else if (normal_content.content !== "") {
            const image = this._captureImage(
                this.normalContentRef.current,
                normal_content.width,
                normal_content.height
            )
            ThemeListActions.setThumbnail(image)
        }
        else {
            PopupActions.showMessage("테마를 등록해주세요")
        }
    }

    handleInfiniteScrolling = (entries, observer) => {
        const load = async (entry, observer) => {
            observer.unobserve(entry.target)
            await this.loadThemes()
            if (entry.target !== this.lastElementRef.current) {
                observer.observe(this.lastElementRef.current)
            }
        }

        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                load(entry, observer)
            }
        })
    }

    observer = null;

    componentDidMount() {
        const load = async (observer) => {
            await this.loadThemes()
            if (observer && this.lastElementRef.current) {
                observer.observe(this.lastElementRef.current)
            }
        }

        this.observer = new IntersectionObserver(
            this.handleInfiniteScrolling, {
            root: null,
            threshold: 0.5,
        })

        this.loadUsers()
        this.loadRecentLinks()

        load(this.observer)
    }

    componentWillUnmount() {
        ThemeListActions.clearPage()

        if (this.lastElementRef.current)
            this.observer.unobserve(this.lastElementRef.current)
    }

    render() {
        const {
            enable_delete,
            enable_update,
            enable_capture,
            edit_loading,
            page,
            show_search,
            theme_search,
            theme_headers,
            themes,
            users,
            tag,
            recent_links,
            origin,
            theme,
        } = this.props

        if (page === PAGE_THEME_LIST) {
            return (
                <ThemeListTemplate
                    showSearch={show_search}
                    searchButton={
                        <ImageButton
                            icon={{
                                enable: "/icon/ic_search.svg"
                            }}
                            onClick={this.handleShowSearch} />
                    }
                    cancelSearchButton={
                        <ImageButton
                            icon={{
                                enable: "/icon/ic_exit.svg"
                            }}
                            onClick={this.handleCancelShowSearch} />
                    }
                    searchInput={
                        <TextInput
                            placeholder="검색어를 입력하세요"
                            value={theme_search}
                            onChange={this.handleChangeSearch} />
                    }
                    uploadThemeList={
                        <ThemeList
                            lastRef={this.lastElementRef}
                            header={theme_headers}
                            items={themes}
                            selected={origin}
                            onOutClick={this.handleOnOutClickTheme}
                            onClick={this.handleClickTheme}
                            onDoubleClick={this.handleDoubleClickTheme}
                            onMenuShow={this.handleOnMenuShowTheme}
                            onUpdate={this.handleGotoUpdateTheme}
                            onDelete={this.handleGotoDeleteTheme} />
                    } />
            )
        }

        return (
            <ThemeItemTemplate
                backBtn={
                    <ImageButton
                        icon={{
                            enable: "/icon/ic_back.svg"
                        }}
                        onClick={this.handleClickBack} />
                }
                deleteBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_delet_enable.svg",
                            disable: "/icon/ic_delet_disable.svg"
                        }}
                        enable={enable_delete}
                        loading={edit_loading}
                        onClick={this.handleDeleteTheme}>삭제</Button>
                }
                updateBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_edit_enable.svg",
                            disable: "/icon/ic_edit_disable.svg"
                        }}
                        enable={enable_update}
                        loading={edit_loading}
                        onClick={this.handleUpdateTheme}>수정</Button>
                }
                userSelector={
                    <UserSelector
                        label="계정"
                        placeholder="계정을 선택하세요"
                        items={users}
                        value={theme.user}
                        onSelected={this.handleUserOnSelected} />
                }
                titleInput={
                    <TextInput
                        label="제목"
                        placeholder="제목을 입력하세요"
                        value={theme.title}
                        onChange={this.handleTitleOnChange} />
                }
                tagInput={
                    <Tag
                        label="태그"
                        placeholder="태그를 입력하고 엔터를 눌러주세요"
                        value={tag}
                        tags={theme.tags}
                        onCreate={this.handleTagOnCreate}
                        onChange={this.handleTagOnChange}
                        onDelete={this.handleTagOnDelete} />
                }
                linkInput={
                    <SuggestTextInput
                        label="링크"
                        value={theme.link}
                        placeholder="주소를 입력하세요"
                        suggests={recent_links}
                        onChange={this.handleLinkOnChange}
                        onSelected={this.handleLinkOnSelected} />
                }
                postPeriod={
                    <DatePeriod
                        label="게시기간"
                        startDateValue={theme.post_start}
                        endDateValue={theme.post_end}
                        onStartChange={this.handleStartDateChange}
                        onEndChange={this.handleEndDateChange} />
                }
                allowDownload={
                    <Switch
                        label="다운로드 허용"
                        value={theme.is_allow_download}
                        onChange={this.handleAllowDownloadChange} />
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
                        autoPlay={false}
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
                        autoPlay={false}
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
    ({ themeList }) => {
        const {
            origin,
            theme
        } = themeList
        var enable_delete = origin !== null

        var enable_capture = false
        var enable_update = false
        if (origin !== null) {
            const valid_user = theme.user !== null
            const update_user = theme.user.id !== origin.user.id

            const valid_title = theme.title !== ""
            const update_title = theme.title !== origin.title

            var update_tag = origin.tags.size !== theme.tags.size
            if (!update_tag) {
                for (let i = 0; i < theme.tags.size; i++) {
                    const tag = origin.tags.find(tag => tag.tag === theme.tags.get(i).tag)
                    if (!tag) {
                        update_tag = true
                        break
                    }
                }
            }
            const valid_link = (
                theme.link === "" || (
                    theme.link.indexOf("http://") !== -1 ||
                    theme.link.indexOf("https://") !== -1
                )
            )
            const update_link = theme.link !== origin.link

            const valid_post = theme.post_start <= theme.post_end
            const update_post = (
                theme.post_start !== origin.post_start ||
                theme.post_end !== origin.post_end
            )

            const update_allow_download = theme.is_allow_download !== origin.is_allow_download

            const valid_thumbnail = (
                theme.origin_thumbnail.image !== "" &&
                theme.default_thumbnail.image !== "" &&
                theme.mini_thumbnail.image !== ""
            )

            const valid_content = (
                (
                    theme.normal_content.content !== "" &&
                    theme.normal_content.preload !== ""
                ) ||
                (
                    theme.large_content.content !== "" &&
                    theme.large_content.preload !== ""
                )
            )
            const clear_normal = (
                theme.normal_content === "" &&
                theme.normal_content.content !== origin.normal_content.content
            )
            const clear_large = (
                theme.large_content === "" &&
                theme.large_content.content !== origin.larget_content.content
            )

            const update_thumbnail = (
                theme.origin_thumbnail.image !== origin.origin_thumbnail.image &&
                theme.default_thumbnail.image !== origin.default_thumbnail.image &&
                theme.mini_thumbnail.image !== origin.mini_thumbnail.image
            )

            const update_content = (
                theme.large_content.content_file !== null ||
                theme.normal_content.content_file !== null ||
                clear_normal ||
                clear_large
            )

            enable_update = (
                valid_user &&
                valid_title &&
                valid_link &&
                valid_post &&
                valid_thumbnail &&
                valid_content && (
                    update_user ||
                    update_title ||
                    update_tag ||
                    update_link ||
                    update_post ||
                    update_allow_download ||
                    update_thumbnail ||
                    update_content
                )
            )

            enable_capture = valid_content
        }

        return {
            enable_delete: enable_delete,
            enable_update: enable_update,
            enable_capture: enable_capture,
            themes_loading: themeList.themes_loading,
            users_loading: themeList.users_loading,
            recent_links_loading: themeList.recent_links_loading,
            loaded_large_content: themeList.loaded_large_content,
            loaded_normal_content: themeList.loaded_normal_content,
            edit_loading: themeList.edit_loading,
            page: themeList.page,
            show_search: themeList.show_search,
            theme_search: themeList.theme_search,
            theme_headers: themeList.theme_headers,
            themes: themeList.themes,
            users: themeList.users,
            tag: themeList.tag,
            recent_links: themeList.recent_links,
            origin: origin,
            theme: theme,
        }
    }
)(ThemeListPage);