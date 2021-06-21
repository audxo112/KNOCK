import React, { Component } from "react";
import styles from "./SuggestTextInput.scss"
import classNames from "classnames/bind";
import Label from "components/Label"
import { DEBUG } from "const/core"
import { List } from "immutable"
import { deepEqual, arraysEqual } from "utils/equals"


const cx = classNames.bind(styles)


class SuggestItem extends Component {
    static defaultProps = {
        item: "",
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.item !== this.props.item
    }

    handleOnSelected = () => {
        const { item, onSelected } = this.props
        onSelected(item)
    }

    render() {
        const { item } = this.props
        return (
            <div className={cx("suggest-item")}
                onClick={this.handleOnSelected}>
                {item}
            </div>
        )
    }
}

class SuggestTextInput extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: "",
        maxLength: null,
        placeholder: "",
        enable: true,
        showRemainText: false,
        suggests: List([]),
        onChange: (value) => {
            if (DEBUG)
                console.log("onChange is not implements", value)
        },
        onSelected: (value) => {
            if (DEBUG)
                console.log("onSelected is not implements", value)
        }
    }

    state = {
        is_open: false
    }

    wrapRef = React.createRef()

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.is_open !== this.state.is_open ||
            nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.value !== this.props.value ||
            nextProps.maxLength !== this.props.maxLength ||
            nextProps.placeholder !== this.props.placeholder ||
            nextProps.enable !== this.props.enable ||
            nextProps.showRemainText !== this.props.showRemainText ||
            !arraysEqual(nextProps.suggests, this.props.suggests)
    }

    handleOnFocus = () => {
        this.setState({
            is_open: true
        })
    }

    handleOnSelect = (value) => {
        const { onSelected } = this.props
        this.setState({
            is_open: false
        })
        onSelected(value)
    }

    handleOutsideClick = (e) => {
        if (!this.state.is_open)
            return;

        const wrap = this.wrapRef.current
        if (wrap && !wrap.contains(e.target)) {
            this.setState({
                is_open: false
            })
        }
    }

    handleChangeInput = (e) => {
        const { value } = e.target
        const { onChange, maxLength } = this.props

        var text = value
        if (maxLength !== null &&
            text.length > maxLength) {
            text = text.substr(0, maxLength)
        }

        onChange(text)
    }

    componentDidMount() {
        document.addEventListener("click", this.handleOutsideClick)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleOutsideClick)
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
        const { maxLength, showRemainText } = this.props;

        if (maxLength === null || !showRemainText)
            return null

        const { value, enable } = this.props
        const remainCount = maxLength - value.length

        return (
            <div className={cx("remain-text",
                (!enable ? "disable" : ""))}>
                {remainCount}자
            </div>
        )
    }

    renderInput() {
        const {
            value,
            maxLength,
            showRemainText,
            enable,
            placeholder
        } = this.props
        const { is_open } = this.state

        return (
            <div className={cx("input-wrap")}>
                <input
                    className={cx("input",
                        (!enable ? "disable" : ""),
                        (is_open ? "open" : ""),
                        (showRemainText ? "show-remain-text" : ""))}
                    value={value}
                    disabled={!enable}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete="off"
                    onFocus={this.handleOnFocus}
                    onChange={this.handleChangeInput} />
                {this.renderRemainText()}
            </div>
        )
    }

    renderList() {
        const { suggests } = this.props
        const { is_open } = this.state
        if (!is_open || suggests.size === 0 || suggests.length === 0)
            return null

        const list = suggests.map((suggest, index) => (
            <SuggestItem
                key={`${index}-${suggest}`}
                item={suggest}
                onSelected={this.handleOnSelect} />
        ))

        return (
            <div className={cx("suggest-list-wrap")}>
                <div className={cx("suggest-list")}>
                    {list}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div
                className={cx("suggest-text-input-wrap")}
                ref={this.wrapRef}>
                {this.renderLabel()}
                <div className={cx("suggest-input-wrap")}>
                    {this.renderInput()}
                    {this.renderList()}
                </div>
            </div>
        )
    }
}

export default SuggestTextInput;