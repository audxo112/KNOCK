import React from "react";
import styles from "./CurationFolderEditTemplate.scss";
import classNames from "classnames/bind";
import { VIEW_TYPE_LIST } from "const";

const cx = classNames.bind(styles);

const CurationFolderEditTemplate = ({
    viewType,
    groupList,
    titleInput,
    subTitleInput,
    descriptionInput,
    coverImage,
    preview,
    deleteBtn,
    updateBtn,
}) => {
    return (<div className={cx("curation-folder-edit-template")}>
        <div className={cx("curation-folder-form")}>
            <div className={cx("primary-pannel")}>
                <div className={cx("group")}>
                    {groupList}
                </div>
            </div>

            {viewType === VIEW_TYPE_LIST ? (
                <div className={cx("can-not-edit")}>
                    폴더를 수정할 수 없습니다.
                </div>
            ) : (<>
                <div className={cx("secondary-pannel")}>
                    <div className={cx("title")}>
                        {titleInput}
                    </div>
                    <div className={cx("sub-title")}>
                        {subTitleInput}
                    </div>
                    <div className={cx("description")}>
                        {descriptionInput}
                    </div>
                </div>

                <div className={cx("third-pannel")}>
                    {viewType !== null && (
                        <div className={cx("cover-image")}>
                            {coverImage}
                        </div>
                    )}

                    <div className={cx("curation-preview")}>
                        {preview}
                    </div>
                </div>
            </>)}

            <div className={cx("control")}>
                <div className={cx("delete")}>
                    {deleteBtn}
                </div>
                <div className={cx("update")}>
                    {updateBtn}
                </div>
            </div>
        </div >
    </div >)
}

export default CurationFolderEditTemplate;