import React from "react";
import styles from "./LoginTemplate.scss";
import classNames from "classnames/bind";
import { STATUS_NONE } from "const/auth"

const cx = classNames.bind(styles)

const LoginTemplate = ({
    loading,
    status,
    googleLogin,
}) => {
    if(loading){
        return <div className={cx("login-template")}>
            <div className={cx("loading-wrap")}>
                <div className={cx("loading")}/>
            </div>
        </div>
    }

    if(status === STATUS_NONE){
        return <></>
    }

    return (
        <div className={cx("login-template")}>
            <div className={cx("logo-pos")}>
                <img
                    className={cx("logo")}
                    src="/image/logo/img_knock_web_editor.svg"
                    alt="로고" />
            </div>
            <div className={cx("google-login-pos")}>
                {googleLogin}
            </div>
        </div>
    )
}

export default LoginTemplate;