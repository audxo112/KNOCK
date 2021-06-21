import React, { Component } from "react";
import styles from "./DatePeriod.scss";
import classNames from "classnames/bind";
import Label from "components/Label";
import { DEBUG } from "const/core";
import { deepEqual } from "utils/equals";

const cx = classNames.bind(styles);

class DatePeriod extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        enable: true,
        startDateValue: "",
        endDateValue: "",
        onStartChange: (value) => {
            if (DEBUG)
                console.log("onStartChange is not implement", value)
        },
        onEndChange: (value) => {
            if (DEBUG)
                console.log("onEndChange is not implement", value)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.enable !== this.props.enable ||
            nextProps.startDateValue !== this.props.startDateValue ||
            nextProps.endDateValue !== this.props.endDateValue
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target;
        const { onStartChange, onEndChange } = this.props;
        if (name === "start_date")
            onStartChange(value)
        else onEndChange(value)
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
        const { enable, startDateValue, endDateValue } = this.props
        const startDate = startDateValue.split("T")[0]
        const endDate = endDateValue.split("T")[0]

        return <div className={cx("date-period-wrap")}>
            {this._renderLabel()}
            <div className={cx("input-wrap")}>
                <input
                    className={cx("input",
                        (!enable ? "disable" : ""))}
                    name="start_date"
                    value={startDate}
                    disabled={!enable}
                    autoComplete="off"
                    type="date"
                    onChange={this.handleChangeInput} />
                <div
                    className={cx("hyphen")}>
                </div>
                <input
                    className={cx("input",
                        (!enable ? "disable" : ""))}
                    name="end_date"
                    value={endDate}
                    disabled={!enable}
                    autoComplete="off"
                    type="date"
                    onChange={this.handleChangeInput} />
            </div>
        </div>
    }
}

export default DatePeriod;