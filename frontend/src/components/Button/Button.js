import React, { Component } from "react";
import styles from "./Button.scss";
import classNames from "classnames/bind";
import styled from "styled-components";
import { DEBUG } from "const/core";
import { deepEqual } from "utils/equals";

const cx = classNames.bind(styles);

const StyledButton = styled.div`
    font-size:${props => props.fontSize || "16px"};
    color:${props => props.color || "black"};
    background-color:${props => props.backgroundColor || "white"};
    width:${props => props.width || "250px"};
    height:${props => props.height || "50px"};
    border-radius: 4px;

    &.disable{
        color:${props => props.disableColor || "#c4c4c4"};
    }

    &:hover{
        background-color:${props => props.hoverColor || props.backgroundColor || "white"};
    }

    &:active{
        background-color:${props => props.activeColor || props.backgroundColor || "white"};
    }
`;

class Button extends Component {
    static defaultProps = {
        icon: {
            enable: "",
            disable: "",
        },
        enable: false,
        loading: false,
        btnStyle: {
            width: "250px",
            height: "50px",
            fontSize: "16px",
            color: "black",
            backgroundColor: "white",
            disableColor: "#c4c4c4",
            hoverColor: "white",
            activeColor: "white",
        },
        onClick: (e) => {
            if (DEBUG)
                console.log("onClick is not implements")
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(nextProps.icon, this.props.icon) ||
            nextProps.enable !== this.props.enable ||
            nextProps.loading !== this.props.loading ||
            !deepEqual(nextProps.btnStyle, this.props.btnStyle)
    }

    _renderContent() {
        const { icon, enable, children } = this.props
        const cIcon = enable ? icon.enable : icon.disable

        return (<>
            {cIcon !== "" &&
                <img
                    className={cx("btn-icon")}
                    alt="버튼 아이콘"
                    src={cIcon} />
            }
            {children}
        </>)
    }

    _renderLoading() {
        return (
            <div className={cx("loading-wrap")}>
                <div className={cx("loading-progress")}>
                </div>
            </div>
        )
    }

    render() {
        const { enable, loading, onClick,
            btnStyle: {
                fontSize,
                width,
                height,
                color,
                backgroundColor,
                disableColor,
                hoverColor,
                activeColor
            }
        } = this.props
        return (
            <StyledButton
                className={cx("btn-wrap",
                    (loading ? "loading" : (enable ? "" : "disable"))
                )}
                fontSize={fontSize}
                width={width}
                height={height}
                color={color}
                backgroundColor={backgroundColor}
                disableColor={disableColor}
                hoverColor={hoverColor}
                activeColor={activeColor}
                onClick={loading ? null : onClick}>
                {loading ?
                    this._renderLoading() :
                    this._renderContent()
                }
            </StyledButton>)
    }
}

export default Button;