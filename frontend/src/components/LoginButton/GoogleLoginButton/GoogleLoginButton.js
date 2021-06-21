import React, { Component } from "react"
import styles from "./GoogleLoginButton.scss"
import classNames from "classnames/bind"
import { DEBUG } from "const/core"

import { GoogleLogin } from "react-google-login"

const cx = classNames.bind(styles)

class GoogleLoginButton extends Component {
    static defaultProps = {
        clientId: "",
        loading: false,
        onSuccess: (result) => {
            if (DEBUG)
                console.log(`onSuccess is not implements`, result)
        },
        onFailure: (result) => {
            if (DEBUG)
                console.log(`onFailure is not implements`, result)
        },
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.clientId !== this.props.clientId ||
            nextProps.loading !== this.props.loading
    }

    renderIcon = () => {
        return (
            <img className={cx("icon")}
                src="/icon/ic_google.svg"
                alt="로고" />
        )
    }

    renderLoading = () => {
        return (
            <div className={cx("loading-wrap")}>
                <div className={cx("loading-progress")}>
                </div>
            </div>
        )
    }

    render() {
        const { clientId, loading, onSuccess, onFailure } = this.props
        return (
            <GoogleLogin
                clientId={clientId}
                onSuccess={onSuccess}
                onFailure={onFailure}
                render={renderProps => {
                    return (<div className={cx("google-button-wrap")}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}>
                        {loading ?
                            this.renderLoading() :
                            this.renderIcon()}
                        <div className={cx("text")}>구글 로그인
                        </div>
                    </div>)
                }}
            />
        )
    }
}

export default GoogleLoginButton;
