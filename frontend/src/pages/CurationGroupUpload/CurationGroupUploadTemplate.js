import React from "react";
import styles from "./CurationGroupUploadTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const CurationGroupUploadTemplate = ({
    orderList,
    titleInput,
    postDate,
    viewType,
    uploadBtn,
}) => {
    return (<div className={cx("curation-group-upload-template")}>
        <div className={cx("curation-group-form")}>
            <div className={cx("primary-pannel")}>
                <div className={cx("order-list")}>
                    {orderList}
                </div>
            </div>

            <div className={cx("secondary-pannel")}>
                <div className={cx("title")}>
                    {titleInput}
                </div>
                <div className={cx("post-date")}>
                    {postDate}
                </div>
            </div>

            <div className={cx("third-pannel")}>
                <div className={cx("view-type")}>
                    {viewType}
                </div>
            </div>

            <div className={cx("control")}>
                <div className={cx("upload")}>
                    {uploadBtn}
                </div>
            </div>
        </div>
    </div>)
}

export default CurationGroupUploadTemplate;