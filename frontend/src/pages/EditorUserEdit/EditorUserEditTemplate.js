import React from "react";
import styles from "./EditorUserEditTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const EditorUserEditTemplate = ({
    userList,
    nicknameInput,
    visibilityUser,
    emailText,
    profileImage,
    updateBtn,
}) => {
    return (
        <div className={cx("editor-user-edit-template")}>
            <div className={cx("editor-user-group-form")}>
                <div className={cx("primary-pannel")}>
                    <div className={cx("user-list")}>
                        {userList}
                    </div>
                </div>
                <div className={cx("secondary-pannel")}>
                    <div className={cx("nickname")}>
                        {nicknameInput}
                    </div>

                    <div className={cx("visibility-user")}>
                        {visibilityUser}
                    </div>

                    <div className={cx("email-text")}>
                        {emailText}
                    </div>
                </div>
                <div className={cx("third-pannel")}>
                    <div className={cx("profile-image")}>
                        {profileImage}
                    </div>
                </div>

                <div className={cx("control")}>
                    <div className={cx("update")}>
                        {updateBtn}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditorUserEditTemplate;