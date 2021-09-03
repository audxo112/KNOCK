import React from "react";
import styles from "./ThemeUploadTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ThemeUploadTemplate = ({
    uploadBtn,
    userSelector,
    titleInput,
    tagInput,
    linkInput,
    postPeriod,
    allowDownload,
    curationSelector,
    thumbnailImage,
    captureBtn,
    largeVideo,
    normalVideo,
}) => {
    return (
        <div className={cx("theme-upload-template")}>
            <div className={cx("header")}>
                <div className={cx("space")}></div>
                <div className={cx("control")}>
                    <div className={cx("upload")}>
                        {uploadBtn}
                    </div>
                </div>
            </div>

            <div className={cx("theme-upload-form")}>
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
                    <div className={cx("curation-selector-pos")}>
                        {curationSelector}
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

export default ThemeUploadTemplate;