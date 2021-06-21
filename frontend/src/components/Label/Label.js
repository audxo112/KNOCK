import React, { Component } from "react";
import styles from "./Label.scss";
import classNames from "classnames/bind"
import styled from "styled-components"
import { deepEqual } from "utils/equals"

const cx = classNames.bind(styles);

const StyledLabel = styled.div`
    font-size:${props => props.fontSize || "18px"};
    font-weight:${props => props.fontWeight || "500"};
    color:${props => props.fontColor || "white"};
    display:inline-flex;

    &.disable{
        color:${props => props.disableColor || "#4A4A4A"};
    }
`;

class Label extends Component {
    static defaultProps = {
        enable: true,
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.enable !== this.props.enable ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle)
    }

    render() {
        const { children } = this.props
        if (children === undefined)
            return null

        const {
            enable,
            labelStyle: {
                fontSize,
                fontWeight,
                fontColor,
                disableColor
            }
        } = this.props

        return (
            <div className={"label-wrap"}>
                <StyledLabel
                    className={cx("label",
                        (!enable ? "disable" : ""))}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    fontColor={fontColor}
                    disableColor={disableColor}>
                    {children}
                </StyledLabel>
            </div >
        )
    }
}

export default Label;