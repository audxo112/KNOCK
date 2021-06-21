import React, { Component } from "react";
import styles from "./CheckBox.scss";
import classNames from "classnames/bind"
import styled from "styled-components"
import { deepEqual } from "utils/equals"
import { DEBUG } from "const/core";

const cx = classNames.bind(styles)

const StyledLabel = styled.div`
    font-size:${props => props.labelStyle.fontSize || "18px"};
    font-weight:${props => props.labelStyle.fontWeight || "500"};
    color:${props => props.labelStyle.fontColor || "white"};
    display:inline-flex;

    &.disable{
        color:${props => props.labelStyle.disableColor || "#4A4A4A"};
    }
`;

class CheckBox extends Component {
    static defaultProps = {
        enable: true,
        loading: false,
        label: "",
        labelStyle: {
            fontSize: "12px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: "",
        checked: false,
        onChecked: (checked, value) => {
            if (DEBUG)
                console.log("onChecked is not implements", checked, value)
        },
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.enable !== this.props.enable ||
            nextProps.loading !== this.props.loading ||
            nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.value !== this.props.value ||
            nextProps.checked !== this.props.checked
    }

    handleOnChecked = () => {
        const { checked, value, onChecked } = this.props
        onChecked(!checked, value)
    }

    renderCheck() {
        const { checked } = this.props
        const img = checked ?
            "/icon/ic_check_box_selected.svg" :
            "/icon/ic_check_box_unselected.svg"
        return (
            <div className={cx("checkbox")}>
                <img
                    alt="체크박스"
                    src={img} />
            </div>
        )
    }

    render() {
        const { className, enable, label, labelStyle } = this.props
        return (
            <div
                className={cx(
                    className,
                    "checkbox-wrap",
                    (!enable ? "disable" : "")
                )}
                onClick={this.handleOnChecked}>
                {this.renderCheck()}
                <StyledLabel
                    className={cx(
                        "label",
                        (!enable ? "disable" : ""))}
                    labelStyle={labelStyle} >{label}</StyledLabel>
            </div>
        )
    }
}

export default CheckBox;