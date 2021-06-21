import React from "react";
import styles from "./FrameUploadTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const FrameUploadTemplate = ({
    frameType,
    userSelector,
    titleInput,
    priorityList,
    scaleTypeSelector,
    repeatModeSelector,
    normalFrame,
    largeFrame,
    uploadBtn
}) => {
    return (
        <div className={cx("frame-upload-template")}>
            <div className={cx("header")}>
                <div className={cx("space")}></div>
                <div className={cx("control")}>
                    <div className={cx("upload")}>
                        {uploadBtn}
                    </div>
                </div>
            </div>

            <div className={cx("frame-form")}>
                <div className={"primary-pannel"}>
                    <div className={cx("priority")}>
                        {priorityList}
                    </div>
                </div>
                <div className={cx("secondary-pannel")}>
                    <div className={cx("user-pos")}>
                        {userSelector}
                    </div>
                    <div className={cx("title-pos")}>
                        {titleInput}
                    </div>

                    <div className={cx("scale-type-pos")}>
                        {scaleTypeSelector}
                    </div>
                    {frameType.indexOf("gif") !== -1 &&
                        (
                            <div className={cx("repeat-mode-pos")}>
                                {repeatModeSelector}
                            </div>
                        )}
                </div>
                <div className={cx("large-frame")}>
                    {largeFrame}
                </div>
                <div className={cx("normal-frame")}>
                    {normalFrame}
                </div>
            </div>
        </div>
    )
}

FrameUploadTemplate.defaultProps = {
    frameType: "image",
};

export default FrameUploadTemplate;