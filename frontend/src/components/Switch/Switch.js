import React, { Component } from "react";
import styles from "./Switch.scss"
import classNames from "classnames/bind"
import Label from "components/Label"
import { DEBUG } from "const/core"
import { deepEqual } from "utils/equals"

const cx = classNames.bind(styles);

class Switch extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: false,
        enable: true,
        onChange: (value) => {
            if (DEBUG)
                console.log("onChange is not implement", value)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.value !== this.props.value ||
            nextProps.enable !== this.props.enable
    }

    handleChange = () => {
        const { value, onChange } = this.props

        onChange(!value)
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

    render() {
        const { value, enable } = this.props

        return <div className={cx("switch-input-wrap")}>
            {this._renderLabel()}
            <div className={cx(
                "switch-wrap",
                (!enable ? "disable" : "")
            )}
                onClick={this.handleChange}>
                <input
                    className={cx("switch")}
                    type="checkbox"
                    checked={value}
                    readOnly />
                <span className={cx("switch-bg")}></span>
                <span
                    className={cx("switch-button")} />
            </div>
        </div>
    }
}

export default Switch