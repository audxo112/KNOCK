import React, { Component } from "react";
import { connect } from "react-redux";
import FrameListTemplate from "./FrameListTemplate"

import { FrameListActions } from "store/actionCreators";
import PriorityList from "components/Priority";
import TextInput from "components/TextInput";
import Selector from "components/Selector";
import ContentView from "components/ContentView";
import ImageButton from "components/ImageButton";
import Button from "components/Button";

import { PopupActions } from "store/actionCreators"

import { frameAPI, editorUserAPI } from "api";
import {
    SCALE_TYPE,
    REPEAT_MODE,
    PRIORITIES
} from "const";
import { UserSelector } from "components/User";
import { PAGE_FRAME_DETAIL, PAGE_FRAME_LIST } from "const/page";
import { FrameList } from "components/Frame";

class FrameListPage extends Component {
    lastElementRef = React.createRef()
    normalFrameRef = React.createRef()
    largeFrameRef = React.createRef()

    state = {
        page: 1
    }

    loadUsers = () => {
        const loader = setTimeout(() => {
            FrameListActions.changeUsersLoading(true)
        }, 300)

        editorUserAPI.getUsers(
        ).then(({ data }) => {
            clearTimeout(loader)
            FrameListActions.changeUsersLoading(false)
            FrameListActions.setUsers(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            FrameListActions.changeUsersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadMaxPriority = () => {
        const loader = setTimeout(() => {
            FrameListActions.changePriorityLoading(true)
        }, 300)

        return frameAPI.getMaxPriority(
        ).then(({ data }) => {
            clearTimeout(loader)
            FrameListActions.changePriorityLoading(false)
            FrameListActions.setMaxPriority(data)
        }).catch((error) => {
            clearTimeout(loader)
            FrameListActions.changePriorityLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadFrames = (priority, refresh = false) => {
        const loader = setTimeout(() => {
            FrameListActions.changeFramesLoading(true)
        }, 300)

        const { page } = this.state

        return frameAPI.getFrames(
            priority,
            page,
        ).then(({ data, status }) => {
            clearTimeout(loader)
            FrameListActions.changeFramesLoading(false)
            if (status === 200) {
                FrameListActions.appendFrames(data.items)
                this.setState({
                    page: page + 1
                })
            }
        }).catch((error) => {
            clearTimeout(loader)
            FrameListActions.changeFramesLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleSelectPriority = (priority) => {
        FrameListActions.selectPriority(priority)
        this.loadFrames(priority)
    }

    handleOnOutClickFrame = () => {
        FrameListActions.unselectFrame()
    }

    handleSelectFrame = (frame) => {
        FrameListActions.selectFrame(frame)
    }

    handleDoubleClickFrame = () => {
        FrameListActions.changePage(PAGE_FRAME_DETAIL)
    }

    handleOnMenuShowFrame = (item) => {
        FrameListActions.selectFrame(item)
    }

    handleGotoUpdateFrame = (item) => {
        FrameListActions.selectFrame(item)
        FrameListActions.changePage(PAGE_FRAME_DETAIL)
    }

    handleGotoDeleteFrame = (item) => {
        FrameListActions.selectFrame(item)
        this.handleDeleteFrame(item)
    }

    handleOnSortEndFrame = (result) => {
        FrameListActions.changeFrameOrder(result)
    }

    handleAppendPriority = () => {
        FrameListActions.appendMaxPriority();
    }

    handleUserOnSelected = (item) => {
        FrameListActions.selectUser(item)
    }

    handleChangeTitle = (value) => {
        FrameListActions.changeTitle(value)
    }

    handleChangePriority = (item) => {
        FrameListActions.changeFramePriority(item.value)
    }

    handleChangeScaleType = (item) => {
        FrameListActions.changeScaleType(item.value)
    }

    handleChangeRepeatMode = (item) => {
        FrameListActions.changeRepeatMode(item.value)
    }

    _captureImage = (image, width, height) => {
        if (!image) return

        const originImage = image.capture("png", width, height)
        const defaultImage = image.capture("png", 360)
        const miniImage = image.capture("png", 100)

        return {
            originImage: originImage,
            defaultImage: defaultImage,
            miniImage: miniImage,
        }
    }

    handleContentOnLoadFiles = (list) => {
        FrameListActions.loadContent(list)
    }

    handleLargeOnLoaded = (color) => {
        const {
            large_image_loaded
        } = this.props
        if (large_image_loaded) return;

        const {
            large_content
        } = this.props.selected.frame

        if (large_content.content === "") return

        const image = this._captureImage(
            this.largeFrameRef.current,
            large_content.width,
            large_content.height,
        )

        FrameListActions.changeDominantColor(color)
        FrameListActions.setThumbnail(image)
    }

    handleNormalOnLoaded = (color) => {
        const {
            normal_image_loaded
        } = this.props

        if (normal_image_loaded) return;

        const {
            normal_content,
            large_content,
        } = this.props.selected.frame

        if (
            large_content.content !== "" ||
            normal_content.content === ""
        ) return

        const image = this._captureImage(
            this.normalFrameRef.current,
            normal_content.width,
            normal_content.height
        )

        FrameListActions.changeDominantColor(color)
        FrameListActions.setThumbnail(image)
    }

    handleLargeOnClear = () => {
        const {
            normal_content
        } = this.props.selected.frame

        FrameListActions.clearLargeContent()

        if (normal_content.content !== "") {
            const image = this._captureImage(
                this.normalFrameRef.current,
                normal_content.width,
                normal_content.height
            )
            FrameListActions.setThumbnail(image)
        }
        else {
            FrameListActions.clearThumbnail()
        }
    }

    handleNormalOnClear = () => {
        const {
            large_content,
        } = this.props.selected.frame

        FrameListActions.clearNormalContent()

        if (large_content.content !== "") {
            FrameListActions.clearThumbnail()
        }
    }

    handleClickBack = () => {
        FrameListActions.changePage(PAGE_FRAME_LIST)
    }

    isValidSave = () => {
        const {
            enable_save
        } = this.props

        if (!enable_save) {
            PopupActions.showMessage("변경된 순서가 없습니다.")
            return false
        }
        return true
    }

    handleSaveFrame = () => {
        if (
            this.props.edit_loading ||
            !this.isValidSave()
        ) return;

        PopupActions.show({
            content: "정말로 순서를 저장하시겠습니까?",
            oneBtn: false,
            onConfirm: this.handleSaveOrders,
        })
    }

    handleSaveOrders = () => {
        const loader = setTimeout(() => {
            FrameListActions.changeEditLoading(true)
        }, 300)

        const {
            origin_frames,
            frames
        } = this.props

        frameAPI.updateOrder(
            origin_frames,
            frames
        ).then(() => {
            clearTimeout(loader)
            FrameListActions.changeEditLoading(false)
            FrameListActions.updateFrameOrders()
        }).catch((error) => {
            clearTimeout(loader)
            FrameListActions.changeEditLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    isValidDelete = () => {
        const {
            enable_delete,
            selected: { origin }
        } = this.props

        if (!enable_delete) {
            if (origin === null) {
                PopupActions.showMessage("선택된 프레임이 없습니다.")
            }
            return false
        }
        return true
    }

    handleDeleteFrame = () => {
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
            FrameListActions.changeEditLoading(true)
        }, 300)

        const { frame } = this.props.selected
        frameAPI.deleteFrame(
            frame.id
        ).then(({ data, status }) => {
            clearTimeout(loader)
            FrameListActions.changeEditLoading(false)
            if (status === 200) {
                FrameListActions.deleteFrame(data.item)
                PopupActions.showMessage("프레임를 삭제했습니다")
            }
            else if (status === 204) {
                FrameListActions.deleteFrame(frame)
                PopupActions.showMessage("프레임를 찾을수 없습니다")
            }
        }).catch((error) => {
            clearTimeout(loader)
            FrameListActions.changeEditLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    isValidUpdate = () => {
        const {
            enable_update,
            selected: { frame, origin },
        } = this.props

        if (!enable_update) {
            if (origin === null) {
                PopupActions.showMessage("프레임을 선택해주세요")
            }
            else if (frame.user === null) {
                PopupActions.showMessage("계정을 선택해주세요")
            }
            else if (frame.title === "") {
                PopupActions.showMessage("제목을 정해주세요")
            }
            else if (frame.priority === null) {
                PopupActions.showMessage("중요도를 선택해주세요")
            }
            else if (frame.scale_type === null) {
                PopupActions.showMessage("스케일 타입을 선택해주세요")
            }
            else if (frame.repeat_mode === null) {
                PopupActions.showMessage("반복모드를 선택해주세요")
            }
            else if (
                frame.large_content.content === "" &&
                frame.normal_content.content === ""
            ) {
                PopupActions.showMessage("컨텐츠를 등록해주세요")
            }
            else {
                PopupActions.showMessage("변경된 데이터가 없습니다.")
            }

            return false;
        }

        return true
    }

    handleUpdateFrame = () => {
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
        const {
            frame,
            origin,
        } = this.props.selected

        const loader = setTimeout(() => {
            FrameListActions.changeEditLoading(true)
        }, 300)

        frameAPI.updateFrame(
            origin,
            frame
        ).then(({ status, data }) => {
            clearTimeout(loader)
            FrameListActions.changeEditLoading(false)
            if (status === 200) {
                FrameListActions.updateFrame(data.item)
                PopupActions.showMessage("프레임을 수정했습니다.")
            }
            else if (status === 204) {
                FrameListActions.deleteFrame(frame)
                PopupActions.showMessage("존재하지 않는 프레임입니다.")
            }
        }).catch((error) => {
            clearTimeout(loader)
            FrameListActions.changeEditLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleInfiniteScrolling = (entries, observer) => {
        const {
            priority,
        } = this.props.selected

        const load = async (entry, observer) => {
            observer.unobserve(entry.target)
            await this.loadFrames(priority)
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
            await this.loadMaxPriority()
            await this.loadFrames(1)
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

        load(this.observer)
    }

    componentWillUnmount() {
        FrameListActions.clearPage()

        if (this.lastElementRef.current)
            this.observer.unobserve(this.lastElementRef.current)
    }

    render() {
        const {
            priority_loading,
            frames_loading,
            edit_loading,
            enable_edit,
            enable_delete,
            enable_update,
            enable_save,
            page,
            is_gif,
            normal_content,
            large_content,
            selected: { priority, frame, origin },
            max_priority,
            frames,
            users,
        } = this.props

        return <>
            <FrameListTemplate
                page={page}
                isGif={is_gif}
                priorityList={
                    <PriorityList
                        label="중요도"
                        value={priority}
                        max={max_priority}
                        selectedFrame={origin}
                        frames={frames}
                        priorityLoading={priority_loading}
                        onSelectPriority={this.handleSelectPriority}
                        onSelectFrame={this.handleSelectFrame}
                        onAppend={this.handleAppendPriority} />
                }
                frameList={
                    <FrameList
                        lastRef={this.lastElementRef}
                        items={frames}
                        selected={origin}
                        loading={frames_loading}
                        onOutClick={this.handleOnOutClickFrame}
                        onClick={this.handleSelectFrame}
                        onDoubleClick={this.handleDoubleClickFrame}
                        onMenuShow={this.handleOnMenuShowFrame}
                        onUpdate={this.handleGotoUpdateFrame}
                        onDelete={this.handleGotoDeleteFrame}
                        onSortEnd={this.handleOnSortEndFrame} />
                }
                userSelector={
                    <UserSelector
                        label="계정"
                        placeholder="계정을 선택하세요"
                        enable={enable_edit}
                        items={users}
                        value={frame.user}
                        onSelected={this.handleUserOnSelected} />
                }
                titleInput={
                    <TextInput
                        label="제목"
                        value={frame.title}
                        enable={enable_edit}
                        placeholder="제목을 입력하세요"
                        maxLength={50}
                        onChange={this.handleChangeTitle} />
                }
                prioritySelector={
                    <Selector
                        label="중요도"
                        enable={enable_edit}
                        value={frame.priority}
                        items={PRIORITIES(max_priority)}
                        itok={(item) => item.value}
                        itov={(item) => item.value}
                        itos={(item) => item.name}
                        placeholder="중요도를 선택하세요."
                        onSelected={this.handleChangePriority} />
                }
                scaleTypeSelector={
                    <Selector
                        label="스케일 타입"
                        enable={enable_edit}
                        value={frame.scale_type}
                        items={SCALE_TYPE}
                        itok={(item) => item.value}
                        itov={(item) => item.value}
                        itos={(item) => item.name}
                        placeholder="스케일 타입을 선택하세요."
                        onSelected={this.handleChangeScaleType} />
                }
                repeatModeSelector={
                    <Selector
                        label="반복모드"
                        enable={enable_edit}
                        value={frame.repeat_mode}
                        items={REPEAT_MODE}
                        itok={(item) => item.value}
                        itov={(item) => item.value}
                        itos={(item) => item.name}
                        placeholder="반복모드를 선택하세요."
                        onSelected={this.handleChangeRepeatMode} />
                }
                largeFrame={
                    <ContentView
                        ref={this.largeFrameRef}
                        label="720"
                        contentStyle={{
                            width: "240px",
                            height: "493px",
                        }}
                        enable={enable_edit}
                        value={large_content}
                        contentType={frame.large_content.content_type}
                        allowTypes={["image"]}
                        enableColorThief={true}
                        onLoadFiles={this.handleContentOnLoadFiles}
                        onLoadedContent={this.handleLargeOnLoaded}
                        onClear={this.handleLargeOnClear}
                    />
                }
                normalFrame={
                    <ContentView
                        ref={this.normalFrameRef}
                        label="raw"
                        contentStyle={{
                            width: "240px",
                            height: "426px",
                        }}
                        enable={enable_edit}
                        value={normal_content}
                        contentType={frame.normal_content.content_type}
                        allowTypes={["image"]}
                        enableColorThief={true}
                        onLoadFiles={this.handleContentOnLoadFiles}
                        onLoadedContent={this.handleNormalOnLoaded}
                        onClear={this.handleNormalOnClear}
                    />
                }
                backBtn={
                    <ImageButton
                        icon={{
                            enable: "/icon/ic_back.svg"
                        }}
                        onClick={this.handleClickBack} />
                }
                saveBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_save_enable.svg",
                            disable: "/icon/ic_save_disable.svg"
                        }}
                        enable={enable_save}
                        loading={edit_loading}
                        onClick={this.handleSaveFrame}>저장하기</Button>
                }
                deleteBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_delet_enable.svg",
                            disable: "/icon/ic_delet_disable.svg"
                        }}
                        enable={enable_delete}
                        loading={edit_loading}
                        onClick={this.handleDeleteFrame}>삭제하기</Button>
                }
                updateBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_edit_enable.svg",
                            disable: "/icon/ic_edit_disable.svg"
                        }}
                        enable={enable_update}
                        loading={edit_loading}
                        onClick={this.handleUpdateFrame}>수정하기</Button>
                }
            />
        </>
    }
}

export default connect(
    ({ frameList }) => {
        const {
            selected: {
                origin, frame
            },
            origin_frames,
            frames,
        } = frameList

        var frame_type = frame.normal_content.content_type
        if (frame_type === "")
            frame_type = frame.large_content.content_type

        const is_gif = frame_type.indexOf("gif") !== -1

        const empty_frame = (
            origin_frames === null ||
            origin_frames.size === 0
        )

        const enable_edit = origin !== null
        const enable_delete = origin !== null

        var enable_update = false

        const getFrameUrl = (content) => {
            if (frame.normal_content.file) return content.content
            else {
                const image = content.content
                const imageChecker = image.split("base64").length
                if (imageChecker > 1) return image
                else if (imageChecker === 1) {
                    var urlEnd
                    if (content.updated.getTime) {
                        urlEnd = content.updated.getTime()
                    }
                    else {
                        urlEnd = new Date(content.updated).getTime()
                    }
                    return `${image}?${urlEnd}`
                }
            }
            return ""
        }

        var normal_content = ""
        var large_content = ""

        if (origin !== null) {
            const valid_user = frame.user !== null
            const update_user = frame.user.id !== origin.user.id

            const valid_title = frame.title !== ""
            const update_title = frame.title !== origin.title

            const valid_priority = frame.priority !== null
            const update_priority = frame.priority !== origin.priority

            const valid_scale_type = frame.scale_type !== null
            const update_scale_type = frame.scale_type !== origin.scale_type

            const valid_repeat_mode = (
                !is_gif || (
                    frame.repeat_mode !== null &&
                    frame.repeat_mode !== "none"
                )
            )
            const update_repeat_mode = frame.repeat_mode !== origin.repeat_mode

            const valid_content = (
                frame.normal_content.content !== "" ||
                frame.large_content.content !== ""
            )
            const clear_normal = (
                frame.normal_content.content === "" &&
                frame.normal_content.content !== origin.normal_content.content
            )
            const clear_large = (
                frame.large_content.content === "" &&
                frame.large_content.content !== origin.large_content.content
            )
            const update_content = (
                frame.large_content.file !== null ||
                frame.normal_content.file !== null ||
                clear_normal ||
                clear_large
            )

            enable_update =
                valid_user &&
                valid_title &&
                valid_priority &&
                valid_scale_type &&
                valid_repeat_mode &&
                valid_content &&
                (
                    update_user ||
                    update_title ||
                    update_priority ||
                    update_scale_type ||
                    update_repeat_mode ||
                    update_content
                )

            normal_content = getFrameUrl(frame.normal_content)
            large_content = getFrameUrl(frame.large_content)
        }

        var enable_save = false
        if (frames !== null && origin_frames !== null) {
            for (let i = 0; i < origin_frames.size; i++) {
                if (origin_frames.get(i).order !== frames.get(i).order) {
                    enable_save = true
                    break;
                }
            }
        }

        return {
            priority_loading: frameList.priority_loading,
            frames_loading: frameList.frames_loading,
            edit_loading: frameList.edit_loading,
            normal_image_loaded: frameList.normal_image_loaded,
            large_image_loaded: frameList.large_image_loaded,
            enable_edit: enable_edit,
            enable_delete: enable_delete,
            enable_update: enable_update,
            enable_save: enable_save,
            page: frameList.page,
            empty_frame: empty_frame,
            is_gif: is_gif,
            normal_content: normal_content,
            large_content: large_content,
            selected: frameList.selected,
            max_priority: frameList.max_priority,
            origin_frames: frameList.origin_frames,
            frames: frameList.frames,
            users: frameList.users,
        }
    }
)(FrameListPage);


// _downloadImage = (url, callback) => {
//     var xhr = new XMLHttpRequest();
//     xhr.onload = () => {
//         var reader = new FileReader();
//         reader.onloadend = function () {
//             callback(reader.result);
//         }
//         reader.readAsDataURL(xhr.response)
//     }
//     xhr.open("GET", url)
//     xhr.responseType = "blob";
//     xhr.send();
// }