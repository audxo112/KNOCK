import React from "react"
import styles from "./ReportUserTemplate.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const ReportUserTemplate = ({
    searchForm,
    filter,
    sanctionsType,
    sanctionsPeriod,
    sanctionsConfirm,
    reportUserList
}) =>  {
    return (
        <div className={cx("report-user-template")}>
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
            <div className={cx("report-user-list")}>
                {reportUserList}
            </div>
        </div>
    )
}

export default ReportUserTemplate;