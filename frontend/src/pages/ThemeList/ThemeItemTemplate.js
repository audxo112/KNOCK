import React from "react";
import styles from "./ThemeItemTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ThemeItemTemplate = ({
    backBtn,
    deleteBtn,
    updateBtn,
    userSelector,
    titleInput,
    tagInput,
    linkInput,
    postPeriod,
    allowDownload,
    thumbnailImage,
    captureBtn,
    largeVideo,
    normalVideo,
}) => {
    return (
        <div className={cx("theme-item-template")}>
            <div className={cx("template-header")}>
                <div className={cx("back")}>
                    {backBtn}
                </div>
                <div className={cx("control")}>
                    <div className={cx("delete")}>
                        {deleteBtn}
                    </div>
                    <div className={cx("update")}>
                        {updateBtn}
                    </div>
                </div>
            </div>

            <div className={cx("theme-item-edit-form")}>
                <div className={cx("primary-pannel")}>
                    <div className={cx("user-selector")}>
                        {userSelector}
                    </div>
                    <div className={cx("title-input-pos")}>
                        {titleInput}
                    </div>
                    <div className={cx("tag-input-pos")}>
                        {tagInput}
                    </div>
                    <div className={cx("link-input-pos")}>
                        {linkInput}
                    </div>
                    <div className={cx("post-period-pos")}>
                        {postPeriod}
                    </div>
                    <div className={cx("allow-download-pos")}>
                        {allowDownload}
                    </div>
                </div>

                <div className={cx("thumbanil")}>
                    <div className={cx("thumbanil-image")}>
                        {thumbnailImage}
                    </div>
                    <div className={cx("capture-btn")}>
                        {captureBtn}
                    </div>
                </div>
                <div className={cx("large-video")}>
                    {largeVideo}
                </div>
                <div className={cx("normal-video")}>
                    {normalVideo}
                </div>
            </div>
        </div>
    )
}

export default ThemeItemTemplate;