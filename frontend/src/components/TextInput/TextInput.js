import React, { Component } from "react";
import styles from "./TextInput.scss";
import classNames from "classnames/bind";
import Label from "components/Label";
import { DEBUG } from "const/core";

const cx = classNames.bind(styles);

class TextInput extends Component {
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
        onChange: (value) => {
            if (DEBUG)
                console.log("onChange is not implements", value)
        }
    }

    handleChangeInput = (e) => {
        const { value } = e.target;
        const { onChange, maxLength } = this.props;

        var text = value
        if (
            maxLength !== null &&
            value.length > maxLength) {
            text = value.substr(0, maxLength)
        }
        onChange(text)
    }

    _renderLabel() {
        const { label, labelStyle, enable } = this.props;
        if (label === "")
            return null

        return (<Label
            enable={enable}
            labelStyle={labelStyle}>
            {label}
        </Label>)
    }

    renderRemainText() {
        const { maxLength, showRemainText } = this.props;

        if (maxLength === null || !showRemainText)
            return null

        const { value, enable } = this.props;

        const remainCount = maxLength - value.length

        return (
            <div className={cx("remain-text",
                (!enable ? "disable" : ""))}>
                {remainCount}자
            </div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps) !== JSON.stringify(this.props))
    }

    render() {
        const { value, maxLength, showRemainText, enable, placeholder } = this.props;
        return <div className={cx("text-input-wrap")}>
            {this._renderLabel()}
            <div className={cx("input-wrap")}>
                <input
                    className={cx("input",
                        (!enable ? "disable" : ""),
                        (showRemainText ? "show-remain-text" : ""))}
                    value={value}
                    disabled={!enable}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete="off"
                    onChange={this.handleChangeInput} />

                {this.renderRemainText()}
            </div>
        </div>
    }
}

export default TextInput;