import React from "react";
import styles from "./CurationThemeUploadTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const CurationThemeUploadTemplate = ({
    searchInput,
    groupList,
    themeList,
    uploadBtn,
}) => {
    return (
        <div className={cx("curation-theme-upload-template")}>
            <div className={cx("template-header")}>
                <div className={cx("search-input")}>
                    {searchInput}
                </div>
                <div className={cx("controls")}>
                    <div className={cx("upload-pos")}>
                        {uploadBtn}
                    </div>
                </div>
            </div>
            <div className={cx("upload-form")}>
                <div className={cx("group-list-pos")}>
                    {groupList}
                </div>

                <div className={cx("theme-list-pos")}>
                    {themeList}
                </div>
            </div>
        </div>
    )
}

export default CurationThemeUploadTemplate;