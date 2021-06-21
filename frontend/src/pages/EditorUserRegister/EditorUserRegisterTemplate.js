import React from "react";
import styles from "./EditorUserRegisterTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const EditorUserRegisterTemplate = ({
    userList,
    nicknameInput,
    profileImage,
    registerBtn,
    userSearchForm,
}) => {
    return (
        <div className={cx("editor-user-register-template")}>
            <div className={cx("editor-user-group-form")}>
                <div className={cx("list-pannel")}>
                    <div className={cx("user-list")}>
                        {userList}
                    </div>
                </div>
                <div className={cx("content-pannel")}>
                    <div className={cx("register-pannel")}>
                        <div className={cx("primary-pannel")}>
                            <div className={cx("nickname")}>
                                {nicknameInput}
                            </div>
                        </div>
                        <div className={cx("secondary-pannel")}>
                            <div className={cx("profile-image")}>
                                {profileImage}
                            </div>
                        </div>
                    </div>

                    <div className={cx("horizontal-divider")}></div>

                    <div className={cx("search-form")}>
                        {userSearchForm}
                    </div>
                </div>

                <div className={cx("control")}>
                    <div className={cx("register")}>
                        {registerBtn}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditorUserRegisterTemplate;