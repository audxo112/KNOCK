import React from "react";
import styles from "./CurationThemeEditTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const CurationThemeEditTemplate = ({
    searchInput,
    groupList,
    themeList,
    saveBtn,
}) => {
    return (
        <div className={cx("curation-theme-edit-template")}>
            <div className={cx("template-header")}>
                <div className={cx("search-input")}>
                    {searchInput}
                </div>
                <div className={cx("controls")}>
                    <div className={cx("save-pos")}>
                        {saveBtn}
                    </div>
                </div>
            </div>

            <div className={cx("edit-form")}>
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

export default CurationThemeEditTemplate;