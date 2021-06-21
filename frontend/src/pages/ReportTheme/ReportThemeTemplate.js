import classNames from "classnames"
import React from "react"
import styles from "./ReportThemeTemplate.scss"

const cx = classNames.bind(styles)

const ReportThemeTemplate = ({
    searchForm,
    filter,
    sanctionsType,
    sanctionsPeriod,
    sanctionsConfirm,
    reportThemeList,
}) => {
    return (
        <div className={cx("report-theme-template")}>
            <div className={cx("search-form")}>
                {searchForm}
            </div>
            <div className={cx("header")}>
                <div className={cx("filter")}>
                    {filter}
                </div>

                <div className={cx("sanctions")}>
                    <div className={cx("sanctions-type")}>
                        {sanctionsType}
                    </div>
                    <div className={cx("sanctions-period")}>
                        {sanctionsPeriod}
                    </div>
                    <div className={cx("sanctions-confirm")}>
                        {sanctionsConfirm}
                    </div>
                </div>       
            </div>
            <div className={cx("report-theme-list")}>
                {reportThemeList}
            </div>
        </div>
    )
}

export default ReportThemeTemplate;