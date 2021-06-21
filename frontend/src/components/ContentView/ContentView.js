import React, { Component } from "react";
import styles from "./ContentView.scss";
import classNames from "classnames/bind";
import Label from "components/Label";
import { DEBUG } from "const/core";
import { deepEqual } from "utils/equals";

const cx = classNames.bind(styles);

class ContentView extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "14px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: "",
        default_value: "",
        contentType: "",
        allowTypes: ["*"],
        banTypes: [],
        contentStyle: {
            width: "240px",
            height: "426px",
        },
        imageStyle: {
            objectFit: "contain",
        },
        enable: true,
        enableDropDown: true,
        enableClearBtn: true,
        onLoadFiles: (list) => {
            if (DEBUG)
                console.log("onLoadFiles is not implements", list)
        },
        onLoadedContent: () => {
            if (DEBUG)
                console.log("onLoadedContent is not implements")
        },
        onClear: () => {
            if (DEBUG)
                console.log("onClear is not implements")
        }
    }

    state = {
        dragging: false
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.dragging !== this.state.dragging ||
            nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.value !== this.props.value ||
            !deepEqual(nextProps.contentStyle, this.props.contentStyle) ||
            !deepEqual(nextProps.imageStyle, this.props.imageStyle) ||
            nextProps.enable !== this.props.enable ||
            nextProps.enableDropDown !== this.props.enableDropDown ||
            nextProps.enableClearBtn !== this.props.enableClearBtn
    }

    dropRef = React.createRef()
    contentRef = React.createRef()

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({
                dragging: true
            })
        }
    }

    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()

        this.setState({
            dragging: false
        })
    }

    isAllowType = (file) => {
        const { allowTypes } = this.props
        if (allowTypes.includes("*"))
            return true

        for (const index in allowTypes) {
            if (file.type.indexOf(allowTypes[index]) !== -1) {
                return true
            }
        }

        return false
    }

    isBanType = (file) => {
        const { banTypes } = this.props
        for (const index in banTypes) {
            if (file.type.indexOf(banTypes[index]) !== -1) {
                return true
            }
        }
        return false
    }

    loadImage = (file, url, onComplete) => {
        const img = document.createElement("img")
        img.src = url
        img.onload = () => {
            const imageData = {
                file: file,
                type: file.type,
                url: url,
                width: img.naturalWidth,
                height: img.naturalHeight
            }

            onComplete(true, imageData)
        }
    }

    loadVideo = (file, url, onComplete) => {
        const video = document.createElement("video")
        video.src = url
        video.onloadeddata = () => {
            const videoData = {
                file: file,
                type: file.type,
                url: url,
                width: video.videoWidth,
                height: video.videoHeight
            }

            onComplete(true, videoData)
        }
    }

    loadFile = (file, url, onComplete) => {
        const { type } = file
        if (type.indexOf("image") !== -1) {
            this.loadImage(file, url, onComplete)
        }
        else if (type.indexOf("video") !== -1) {
            this.loadVideo(file, url, onComplete)
        }
        else {
            onComplete(false)
        }
    }

    loadFiles = (files) => {
        const { onLoadFiles } = this.props
        const list = []
        const total = files.length
        var progress = 0

        const onComplete = (complete, file) => {
            progress++;

            if (complete) {
                list.push(file)
                if (total <= progress && list.length > 0) {
                    onLoadFiles(list)
                }
            }
        }

        Array.from(files).forEach(file => {
            if (this.isBanType(file)) {
                onComplete(false)
                return;
            }

            if (!this.isAllowType(file)) {
                onComplete(false)
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.loadFile(file, e.target.result, onComplete)
            }
            reader.readAsDataURL(file)
        })
    }

    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()

        this.setState({
            dragging: false
        })

        const { files } = e.dataTransfer

        if (files && files.length > 0) {
            this.loadFiles(files)

            e.dataTransfer.clearData()
        }
    }

    getCanvasUrl(canvas, option) {
        if (option === "jpg") {
            return canvas.toDataURL("image/jpeg", 0.7)
        }
        else {
            return canvas.toDataURL("image/png")
        }
    }

    dataURLtoFile(dataurl, ext) {
        const date = new Date()
        const year = date.getFullYear()
        const month = `${date.getMonth() + 1}`.padStart(2, "0")
        const day = `${date.getDate()}`.padStart(2, "0")
        const hour = `${date.getHours()}`.padStart(2, "0")
        const minute = `${date.getMinutes()}`.padStart(2, "0")
        const second = `${date.getSeconds()}`.padStart(2, "0")
        const filename = `${year}${month}${day}${hour}${minute}${second}.${ext}`

        var arr = dataurl.split(","),
            mine = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n)

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }

        return new File([u8arr], filename, { type: mine })
    }

    getContentWidth() {
        const { contentType } = this.props
        const content = this.contentRef.current
        if (!content) return 0

        if (contentType.indexOf("image") !== -1) {
            return content.naturalWidth
        }
        else if (contentType.indexOf("video") !== -1) {
            return content.videoWidth
        }

        return 0
    }

    getContentHeight() {
        const { contentType } = this.props
        const content = this.contentRef.current
        if (!content) return 0

        if (contentType.indexOf("image") !== -1) {
            return content.naturalHeight
        }
        else if (contentType.indexOf("video") !== -1) {
            return content.videoHeight
        }

        return 0
    }

    _captureImage(width, option) {
        const content = this.contentRef.current

        const w = width
        const h = parseInt(this.getContentHeight() * w / this.getContentWidth())

        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h

        const ctx = canvas.getContext("2d")
        ctx.drawImage(content, 0, 0, w, h)

        const url = this.getCanvasUrl(canvas, option)
        const file = this.dataURLtoFile(url, option)

        return {
            file: file,
            type: file.type,
            url: url,
            width: w,
            height: h,
        }
    }

    _captureImageWithCenterCrop = (width, height, option) => {
        const content = this.contentRef.current;

        const sw = this.getContentWidth()
        const sh = this.getContentHeight()

        var cw = 0;
        var ch = 0;
        if (width / height < sw / sh) {
            cw = parseInt(width / height * sh)
            ch = sh
        }
        else {
            cw = sw
            ch = parseInt(height / width * sw)
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx.drawImage(content, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, width, height)

        const url = this.getCanvasUrl(canvas, option)
        const file = this.dataURLtoFile(url, option)

        return {
            file: file,
            type: file.type,
            url: url,
            width: width,
            height: height,
        }
    }

    capture = (option = "jpg", width = -1, height = -1) => {
        if (width === -1 && height === -1) {
            return this._captureImage(this.getContentWidth(), this.getContentHeight(), option)
        }
        else if (height === -1)
            return this._captureImage(parseInt(width), option)
        else
            return this._captureImageWithCenterCrop(parseInt(width), parseInt(height), option)
    }

    loadedData = null

    handleLoadedData = () => {
        const { onLoadedContent } = this.props
        if (this.loadedData)
            clearTimeout(this.loadedData)

        this.loadedData = setTimeout(() => {
            this.loadedData = null
            onLoadedContent()
        }, 300)
    }

    handleOnClear = () => {
        const { onClear } = this.props
        onClear()
    }

    componentDidMount() {
        let div = this.dropRef.current
        if (!div) return
        div.addEventListener("dragenter", this.handleDragIn)
        div.addEventListener("dragleave", this.handleDragOut)
        div.addEventListener("dragover", this.handleDrag)
        div.addEventListener("drop", this.handleDrop)
    }

    componentWillUnmount() {
        let div = this.dropRef.current
        if (!div) return
        div.removeEventListener("dragenter", this.handleDragIn)
        div.removeEventListener("dragleave", this.handleDragOut)
        div.removeEventListener("dragover", this.handleDrag)
        div.removeEventListener("drop", this.handleDrop)
    }

    _renderLabel() {
        const { label, labelStyle, enable } = this.props;
        if (label === "")
            return null

        return (
            <Label
                enable={enable}
                labelStyle={labelStyle}>
                {label}
            </Label>
        )
    }

    _renderClearBtn() {
        const { value, enableClearBtn } = this.props
        if (!enableClearBtn || value === "")
            return null

        return (
            <img className={cx("clear-btn")}
                alt="정리버튼"
                src="/icon/ic_delete_circle.svg"
                onClick={this.handleOnClear} />
        )
    }

    _renderImageView() {
        const { value, default_value, imageStyle } = this.props
        if (value === "") {
            if (default_value === "") return null

            return <img
                className={cx("default-view")}
                src={default_value}
                alt="default" />
        }

        return <img className={cx("image-view")}
            style={imageStyle}
            src={value}
            ref={this.contentRef}
            alt="view"
            onLoad={this.handleLoadedData} />
    }

    _renderVideoView() {
        const { value, default_value } = this.props
        if (value === "") {
            if (default_value === "") return null

            return <img
                className={cx("default-view")}
                src={default_value}
                alt="default" />
        }

        return <video className={cx("video-view")}
            loop controls
            autoPlay={true}
            src={value}
            ref={this.contentRef}
            onLoadedData={this.handleLoadedData} />
    }

    _renderContentView() {
        const { contentType } = this.props

        if (!contentType)
            return null

        if (contentType.indexOf("image") !== -1) {
            return this._renderImageView()
        }
        else if (contentType.indexOf("video") !== -1) {
            return this._renderVideoView()
        }

        return null
    }

    render() {
        const { enable, contentStyle, enableDropDown } = this.props
        const { dragging } = this.state

        return (
            <div className={cx(
                "content-view-wrap",
                (!enable ? "disable" : ""))}>
                {this._renderLabel()}
                <div className={cx("content-wrap")}
                    style={contentStyle}>

                    {enableDropDown ? (
                        <div className={cx(
                            "drag-and-drop",
                            (dragging ? "dragging" : ""))}
                            ref={this.dropRef}>
                            {this._renderContentView()}
                            {dragging && (
                                <div className={cx("dragging-box")}>
                                    파일을 끌어다 놓으세요
                                </div>
                            )}
                        </div>
                    ) : (
                        this._renderContentView()
                    )}

                    {this._renderClearBtn()}
                </div>
            </div>
        )
    }
}

export default ContentView;