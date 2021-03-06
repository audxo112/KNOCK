import React, { Component } from "react";
import { connect } from "react-redux";
import FrameUploadTemplate from "./FrameUploadTemplate"

import TextInput from "components/TextInput"
import Selector from "components/Selector";
import ContentView from "components/ContentView";
import Button from "components/Button";
import PriorityList from "components/Priority";
import { UserSelector } from "components/User";

import {
    FrameUploadActions,
    PopupActions
} from "store/actionCreators"

import { SCALE_TYPE, REPEAT_MODE } from "const/frame";
import { frameAPI, editorUserAPI } from "api";

class FrameUploadPage extends Component {
    normalContentRef = React.createRef()
    largeContentRef = React.createRef()

    loadUsers = () => {
        const loader = setTimeout(() => {
            FrameUploadActions.changeUsersLoading(true)
        }, 300)

        editorUserAPI.getUsers(
        ).then(({ data }) => {
            clearTimeout(loader)
            FrameUploadActions.changeUsersLoading(false)
            FrameUploadActions.setUsers(data.items)
        }).catch((error) => {
            clearTimeout(loader)
            FrameUploadActions.changeUsersLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    loadPriorities = () => {
        const loader = setTimeout(() => {
            FrameUploadActions.changePriorityLoading(true)
        }, 300)

        frameAPI.getMaxPriority().then(({ status, data }) => {
            clearTimeout(loader)
            FrameUploadActions.changePriorityLoading(false)
            if (status === 200) {
                FrameUploadActions.setMaxPriority(data)
            }
            else if (status === 204) {
                FrameUploadActions.setMaxPriority(1)
            }
        }).catch((error) => {
            clearTimeout(loader)
            FrameUploadActions.changePriorityLoading(false)
            PopupActions.showResponseError(error)
        })
    }

    handleSelectPriority = (priority) => {
        FrameUploadActions.selectPriority(priority)
    }

    handleAppendPriority = () => {
        FrameUploadActions.appendMaxPriority()
    }

    handleUserOnSelected = (item) => {
        FrameUploadActions.selectUser(item)
    }

    handleChangeTitle = (value) => {
        FrameUploadActions.changeTitle(value)
    }

    handleChangeScaleType = (item) => {
        FrameUploadActions.changeScaleType(item.value)
    }

    handleChangeRepeatMode = (item) => {
        FrameUploadActions.changeRepeatMode(item.value)
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
        FrameUploadActions.loadContent(list)
    }

    handleLargeOnLoaded = (color) => {
        const {
            large_content
        } = this.props.frame

        if (large_content.content === "") return

        const image = this._captureImage(
            this.largeContentRef.current,
            large_content.width,
            large_content.height,
        )

        FrameUploadActions.changeDominantColor(color)
        FrameUploadActions.setThumbnail(image)
    }

    handleNormalOnLoaded = (color) => {
        const {
            large_content,
            normal_content,
        } = this.props.frame

        if (normal_content.content === "") return

        if (large_content.connect === "") {
            const image = this._captureImage(
                this.normalContentRef.current,
                normal_content.width,
                normal_content.height,
            )
            FrameUploadActions.changeDominantColor(color)
            FrameUploadActions.setThumbnail(image)
        }
    }

    handleNormalOnClear = () => {
        FrameUploadActions.clearNormalContent()
    }

    handleLargeOnClear = () => {
        FrameUploadActions.clearLargeContent()
    }

    isValidUpload = () => {
        const {
            enable_upload,
            frame_type,
            frame } = this.props;

        if (!enable_upload) {
            if (frame.user === null) {
                PopupActions.showMessage("????????? ??????????????????")
            }
            else if (frame.title === "") {
                PopupActions.showMessage("????????? ???????????????")
            }
            else if (frame.scale_type === null) {
                PopupActions.showMessage("????????? ????????? ???????????????")
            }
            else if (frame.priority === null) {
                PopupActions.showMessage("??????????????? ???????????????")
            }
            else if (
                frame_type.indexOf("gif") !== -1 &&
                frame.repeat_mode === null) {
                PopupActions.showMessage("??????????????? ???????????????")
            }
            else if (
                frame.normal_content.content_file === null &&
                frame.large_content.content_file === null) {
                PopupActions.showMessage("???????????? ??????????????????")
            }
            else if (
                frame.origin_thumbnail.file === null ||
                frame.default_thumbnail.file === null ||
                frame.mini_thumbnail.file === null) {
                PopupActions.showMessage("?????????????????? ??????????????????.\n?????? ???????????? ??????????????????")
            }
            return false;
        }

        return true;
    }

    handleUploadFrame = () => {
        if (
            this.props.upload_loading ||
            !this.isValidUpload()
        ) return;

        const loader = setTimeout(() => {
            FrameUploadActions.changeUploadLoading(true);
        }, 300)

        const { frame } = this.props
        frameAPI.uploadFrame(
            frame
        ).then(() => {
            clearTimeout(loader)
            FrameUploadActions.changeUploadLoading(false);
            FrameUploadActions.clearForm();
            PopupActions.showMessage("???????????? ??????????????????.")
        }).catch((error) => {
            clearTimeout(loader)
            FrameUploadActions.changeUploadLoading(false);
            PopupActions.showResponseError(error)
        })
    }

    componentDidMount() {
        this.loadUsers()
        this.loadPriorities()
    }

    componentWillUnmount() {
        FrameUploadActions.clearPage()
    }

    render() {
        const {
            upload_loading,
            priority_loading,
            frame_loading,
            enable_upload,
            frame_type,
            max_priority,
            frame,
            users,
        } = this.props;

        return <>
            <FrameUploadTemplate
                frameType={frame_type}
                userSelector={
                    <UserSelector
                        label="??????"
                        placeholder="????????? ???????????????"
                        items={users}
                        value={frame.user}
                        onSelected={this.handleUserOnSelected} />
                }
                titleInput={
                    <TextInput
                        label="??????"
                        value={frame.title}
                        placeholder="????????? ???????????????"
                        onChange={this.handleChangeTitle} />
                }
                priorityList={
                    <PriorityList
                        label="?????????"
                        value={frame.priority}
                        max={max_priority}
                        priorityLoading={priority_loading}
                        frameLoading={frame_loading}
                        onSelectPriority={this.handleSelectPriority}
                        onAppend={this.handleAppendPriority} />
                }
                scaleTypeSelector={
                    <Selector
                        label="????????? ??????"
                        value={frame.scale_type}
                        items={SCALE_TYPE}
                        itok={(item) => item.value}
                        itov={(item) => item.value}
                        itos={(item) => item.name}
                        placeholder="????????? ????????? ???????????????."
                        onSelected={this.handleChangeScaleType} />
                }
                repeatModeSelector={
                    <Selector
                        label="????????????"
                        value={frame.repeat_mode}
                        items={REPEAT_MODE}
                        itok={(item) => item.value}
                        itov={(item) => item.value}
                        itos={(item) => item.name}
                        placeholder="??????????????? ???????????????."
                        onSelected={this.handleChangeRepeatMode} />
                }
                largeFrame={
                    <ContentView
                        ref={this.largeContentRef}
                        label="720"
                        contentStyle={{
                            width: "240px",
                            height: "493px",
                        }}
                        value={frame.large_content.content}
                        contentType={frame.large_content.content_type}
                        allowTypes={["image"]}
                        enableColorThief={true}
                        onLoadFiles={this.handleContentOnLoadFiles}
                        onLoadedContent={this.handleLargeOnLoaded}
                        onClear={this.handleLargeOnClear} />
                }
                normalFrame={
                    <ContentView
                        ref={this.normalContentRef}
                        label="raw"
                        contentStyle={{
                            width: "240px",
                            height: "426px",
                        }}
                        value={frame.normal_content.content}
                        contentType={frame.normal_content.content_type}
                        allowTypes={["image"]}
                        enableColorThief={true}
                        onLoadFiles={this.handleContentOnLoadFiles}
                        onLoadedContent={this.handleNormalOnLoaded}
                        onClear={this.handleNormalOnClear} />
                }
                uploadBtn={
                    <Button
                        icon={{
                            enable: "/icon/ic_upload_enable.svg",
                            disable: "/icon/ic_upload_disable.svg"
                        }}
                        enable={enable_upload}
                        loading={upload_loading}
                        onClick={this.handleUploadFrame}>????????? ?????????</Button>
                }
            />
        </>
    }
}

export default connect(
    ({ frameUpload }) => {
        const { frame } = frameUpload

        const frame_type = frame.large_content.content_type === "" ?
            frame.large_content.content_type :
            frame.normal_content.content_type

        const valid_repeat_mode = (
            frame_type.indexOf("gif") === -1 ||
            (
                frame_type.indexOf("gif") !== -1 &&
                frame.repeat_mode !== ""
            )
        )

        const valid_content = (
            frame.large_content.content_file !== null ||
            frame.normal_content.content_file !== null
        )

        const valid_thumbnail = (
            frame.origin_thumbnail.file !== null &&
            frame.default_thumbnail.file !== null &&
            frame.mini_thumbnail.file !== null
        )

        const enable_upload =
            frame.user !== null &&
            frame.title !== "" &&
            frame.priority !== null &&
            frame.scale_type !== null &&
            valid_repeat_mode &&
            valid_content &&
            valid_thumbnail

        return {
            upload_loading: frameUpload.upload_loading,
            priority_loading: frameUpload.priority_loading,
            frame_loading: frameUpload.frame_loading,
            enable_upload: enable_upload,
            max_priority: frameUpload.max_priority,
            frame_type: frame_type,
            frame: frame,
            users: frameUpload.users,
        }
    }
)(FrameUploadPage);