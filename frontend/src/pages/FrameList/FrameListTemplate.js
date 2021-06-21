import React from "react";
import styles from "./FrameListTemplate.scss";
import classNames from "classnames/bind";
import { PAGE_FRAME_LIST, PAGE_FRAME_DETAIL } from "const/page"

const cx = classNames.bind(styles);

const FrameListTemplate = ({
    page,
    isGif,
    priorityList,
    frameList,
    userSelector,
    titleInput,
    prioritySelector,
    scaleTypeSelector,
    repeatModeSelector,
    largeFrame,
    normalFrame,
    backBtn,
    saveBtn,
    deleteBtn,
    updateBtn,
}) => {
    return (
        <div className={cx("frame-list-template")}>
            <div className={cx("template-header")}>
                {page === PAGE_FRAME_DETAIL && (
                    <div className={cx("back-pos")}>
                        {backBtn}
                    </div>
                )}

                <div className={cx("space")}></div>
                <div className={cx("control")}>
                    {page === PAGE_FRAME_LIST && (<>
                        <div className={cx("save-pos")}>
                            {saveBtn}
                        </div>
                    </>)}
                    {page === PAGE_FRAME_DETAIL && (<>
                        <div className={cx("delete-pos")}>
                            {deleteBtn}
                        </div>
                        <div className={cx("update-pos")}>
                            {updateBtn}
                        </div>
                    </>)}
                </div>
            </div>

            <div className={cx("frame-form")}>
                <div className={"primary-pannel"}>
                    <div className={cx("priority-list-pos")}>
                        {priorityList}
                    </div>
                </div>

                {page === PAGE_FRAME_DETAIL && (<>
                    <div className={cx("secondary-pannel")}>
                        <div className={cx("user-selector-pos")}>
                            {userSelector}
                        </div>
                        <div className={cx("title-input-pos")}>
                            {titleInput}
                        </div>
                        <div className={cx("priority-selector-pos")} >
                            {prioritySelector}
                        </div>
                        <div className={cx("scale-type-selector-pos")} >
                            {scaleTypeSelector}
                        </div>
                        {isGif && (
                            <div className={cx("repeat-mode-selector-pos")}>
                                {repeatModeSelector}
                            </div>
                        )}
                    </div >
                    <div className={cx("large-frame-pos")}>
                        {largeFrame}
                    </div>
                    <div className={cx("normal-frame-pos")}>
                        {normalFrame}
                    </div>
                </>)}

                {page === PAGE_FRAME_LIST && (<>
                    <div className={cx("frame-list-pos")}>
                        {frameList}
                    </div>
                </>)}
            </div>
        </div>
    )
};

export default FrameListTemplate;