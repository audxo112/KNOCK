import React, { Component } from "react"
import styles from "./ImageButton.scss"
import classNames from "classnames/bind";
import { DEBUG } from "const/core"
import { deepEqual } from "utils/equals"

const cx = classNames.bind(styles)

class ImageButton extends Component {
    static defaultProps = {
        icon: {
            enable: "",
            disable: "",
        },
        enable: true,
        loading: false,
        btnStyle: {
            width: "48px",
            height: "48px",
            padding: "12px"
        },
        onClick: () => {
            if (DEBUG)
                console.log("onClick is not implements")
        }
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps.icon, this.props.icon) ||
            nextProps.enable !== this.props.enable ||
            nextProps.loading !== this.props.loading ||
            !deepEqual(nextProps.btnStyle, this.props.btnStyle)
    }

    handleOnClick = () => {
        const { onClick } = this.props
        onClick()
    }

    renderImgBtn() {
        const { icon, enable, btnStyle } = this.props
        const cIcon = enable ? icon.enable : icon.disable
        return (
            <img
                className={cx("img-btn")}
                alt="이미지 버튼"
                style={btnStyle}
                src={cIcon}
                onClick={this.handleOnClick} />
        )
    }

    renderLoading() {
        return (
            <div className={cx("loading-wrap")}>
                <div className={cx("loading-progress")}></div>
            </div>
        )
    }

    render() {
        const { loading } = this.props
        return (
            <div className={cx("img-btn-wrap")}>
                {loading ? (
                    this.renderLoading()
                ) : (
                    this.renderImgBtn()
                )}
            </div>
        )
    }
}

export default ImageButton