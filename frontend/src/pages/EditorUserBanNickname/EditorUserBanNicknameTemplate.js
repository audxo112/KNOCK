import React from "react"
import styles from "./EditorUserBanNicknameTemplate.scss";
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const EditorUserBanNicknameTemplate = ({
    banNicknameInput,
    uploadBtn,
    banNicknameList,
}) => {
    return (
        <div className={cx("editor-user-ban-nickname-template")}>
            <div className={cx("ban-nickname-input-form")}>
                <div className={cx("ban-nickname-input")}>
                    {banNicknameInput}
                </div>
                <div className={cx("upload")}>
                    {uploadBtn}
                </div>
            </div>
            <div className={cx("ban-nickname-list-pos")}>
                {banNicknameList}
            </div>
        </div>
    )
}

export default EditorUserBanNicknameTemplate;