import React from "react";
import styles from "./CurationGroupEditTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const CurationGroupEditTemplate = ({
    groupList,
    titleInput,
    postDate,
    deleteBtn,
    updateBtn,
}) => {
    return (<div className={cx("curation-group-edit-template")}>
        <div className={cx("curation-group-form")}>
            <div className={cx("primary-pannel")}>
                <div className={cx("group-list")}>
                    {groupList}
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
    </div>)
}

export default CurationGroupEditTemplate;