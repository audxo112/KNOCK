import React, { Component } from "react";
import styles from "./CheckableTextInput.scss";
import classNames from "classnames/bind";
import Label from "components/Label";
import { DEBUG } from "const/core";
import { deepEqual } from "utils/equals";

const cx = classNames.bind(styles);

const REG_EXP = /[{}[\]/?.,;:|)*~`!^\-+<>@#$%&\\=('" ]/gi;
const SUP_MITY_REG_EXP = /[{}[\]/?.;:|)*~`!^\-+<>@#$%&\\=('" ]/gi;

export const CHECK_FAILED = "CheckableTextInput/CHECK_FAILED"
export const CHECK_SUCCESS = "CheckableTextInput/CHECK_SUCCESS"
export const CHECK_NONE = "CheckableTextInput/CHECK_NONE"
export const CHECK_LOADING = "CheckableTextInput/CHECK_LOADING"

class CheckableTextInput extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: "",
        replace: false,
        minLength: 2,
        maxLength: null,
        placeholder: "",
        enable: true,
        showCheckIcon: true,
        showRemainText: false,
        multi: false,
        multiDivider: ",",
        status_check: CHECK_NONE,
        message: "",
        onChange: (value) => {
            if (DEBUG)
                console.log("onChange is not implements", value)
        },
        onCheck: (value) => {
            if (DEBUG)
                console.log("onCheck is not implements", value)
        },
        onChangeStatus: (status, message) => {
            if (DEBUG)
                console.log("onChangeStatus is not implements", status, message)
        },
        onEnter: () => {
            if (DEBUG)
                console.log("onEnter is not implements")
        },
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.value !== this.props.value ||
            nextProps.placeholder !== this.props.placeholder ||
            nextProps.enable !== this.props.enable ||
            nextProps.showRemainText !== this.props.showRemainText ||
            nextProps.status_check !== this.props.status_check ||
            nextProps.message !== this.props.message
    }

    checkloader = null
    replaceLoader = null

    startCheckLoader = (text) => {
        const { onCheck } = this.props
        this.checkloader = setTimeout(() => {
            onCheck(text)
        }, 500)
    }

    startReplaceLoader = (text) => {
        const { status_check, message, onChangeStatus } = this.props
        const beforeStatus = status_check
        const beforeMessage = message

        const delay = status_check === CHECK_LOADING ? 1000 : 1500

        this.replaceLoader = setTimeout(() => {
            if (beforeStatus === CHECK_LOADING) {
                this.handleCheckInput(text)
            }
            else {
                onChangeStatus(beforeStatus, beforeMessage)
            }
        }, delay)
    }

    clearLoader = () => {
        if (this.checkloader !== null) {
            clearTimeout(this.checkloader)
            this.checkloader = null
        }

        if (this.replaceLoader !== null) {
            clearTimeout(this.replaceLoader)
            this.replaceLoader = null
        }
    }

    handleChangeInput = (e) => {
        const { value } = e.target
        const { value: old, replace, multi, onChange, onChangeStatus, maxLength } = this.props

        this.clearLoader()

        var text = value
        if (maxLength !== null &&
            text.length > maxLength) {
            text = text.substr(0, maxLength)
        }

        if (replace) {
            const r = multi ? SUP_MITY_REG_EXP : REG_EXP
            text = text.replace(r, "")
        }

        if (text !== old) {
            text = text.replaceAll(/,{2,}/gi, ",")

            this.handleCheckInput(text)
            onChange(text)
        }
        else {
            this.startReplaceLoader(text)
            onChangeStatus(CHECK_FAILED, `"${value.slice(-1)}"는 사용할 수 없는 문자 입니다`)
        }
    }

    checkTextLength = (text) => {
        const { multi, minLength, onChangeStatus } = this.props

        if (minLength === null)
            return true;

        if (multi) {
            const texts = text.split(",").map(t => t.trim())
            text = texts.pop()

            if (texts.length > 1) {
                const invalidTexts = texts.filter(t => minLength > t.length)
                if (invalidTexts.length > 0) {
                    onChangeStatus(CHECK_FAILED, `"${invalidTexts.join()}"는 너무 짧습니다.`)
                    return false;
                }
            }
        }

        if (minLength > text.length) {
            onChangeStatus(CHECK_NONE)
            return false;
        }

        return true;
    }

    handleCheckInput = (text) => {
        const { onChangeStatus } = this.props

        if (!this.checkTextLength(text)) {
            return;
        }

        onChangeStatus(CHECK_LOADING)

        this.startCheckLoader(text)
    }

    handleStatus = (status, message = "") => {
        this.setState({
            status,
            message
        })
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            const { onEnter } = this.props;
            onEnter();
        }
    }

    renderLabel() {
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

    renderRemainText() {
        const { enable, maxLength, showRemainText } = this.props;

        if (maxLength === null || !showRemainText || !enable)
            return null

        const { value } = this.props
        const remainCount = maxLength - value.length

        return (
            <div className={cx("remain-text",
                (!enable ? "disable" : ""))}>
                {remainCount}자
            </div>
        )
    }

    renderCheckIcon() {
        const { enable, showCheckIcon, status_check } = this.props
        if (!enable || !showCheckIcon)
            return null

        if (status_check === CHECK_LOADING)
            return (
                <div className={cx("loading-wrap")}>
                    <div className={cx("loading-progress")}></div>
                </div>
            )

        var iconSrc = ""
        if (status_check === CHECK_SUCCESS) {
            iconSrc = "/icon/ic_check_checked.svg"
        }
        else {
            iconSrc = "/icon/ic_check_unchecked.svg"
        }

        return (
            <div className={cx("icon-wrap")}>
                <img
                    className={cx("icon")}
                    alt="체크"
                    src={iconSrc} />
            </div>
        )
    }

    renderMessage() {
        const { enable, status_check, message } = this.props
        if (!enable ||
            status_check !== CHECK_FAILED ||
            message === "")
            return null;

        return (<div className={cx("message-wrap")}>
            <div className={cx("message")}>{message}</div>
        </div>)
    }

    renderInput() {
        const {
            value,
            maxLength,
            showRemainText,
            enable,
            placeholder,
            status_check
        } = this.props

        return (
            <div className={cx("input-wrap")}>
                <input
                    className={cx("input",
                        (!enable ? "disable" : ""),
                        (showRemainText ? "show-remain-text" : ""),
                        (status_check === CHECK_FAILED ? "check-failed" : ""))}
                    value={value}
                    disabled={!enable}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete="off"
                    onChange={this.handleChangeInput}
                    onKeyPress={this.handleKeyPress} />
                {this.renderRemainText()}
                {this.renderCheckIcon()}
                {this.renderMessage()}
            </div>
        )
    }

    render() {
        return (
            <div className={cx("checkable-text-input-wrap")}>
                {this.renderLabel()}
                {this.renderInput()}
            </div>
        )
    }
}

export default CheckableTextInput;