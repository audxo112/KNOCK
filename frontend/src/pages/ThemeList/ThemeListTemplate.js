import React from "react";
import styles from "./ThemeListTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ThemeListTemplate = ({
    templateRef,
    showSearch,
    searchButton,
    cancelSearchButton,
    searchInput,
    uploadThemeList,
}) => {
    return (
        <div
            ref={templateRef}
            className={cx("theme-list-template")}>
            <div className={cx("search-form")}>
                <div className={cx("search-icon")}>
                    {showSearch ?
                        cancelSearchButton :
                        searchButton}
                </div>

                {showSearch && (
                    <div className={cx("search-input")}>
                        {searchInput}
                    </div>
                )}
            </div>
            <div className={cx("upload-theme-list")}>
                {uploadThemeList}
            </div>
        </div>
    )
}

export default ThemeListTemplate;