import React, {Component} from "react"
import {connect} from "react-redux"
import ReportThemeTemplate from "./ReportThemeTemplate"


class ReportThemePage extends Component{
    render(){
        return (
            <ReportThemeTemplate
                searchForm={"검색"}
                filter={"필터"}
                sanctionsType={"제재 유형"}
                sanctionsPeriod={"제재 기간"}
                sanctionsConfirm={"제재확정"}
                reportThemeList={"테마 리스트"}/>
        )
    }
}

export default connect(
    () => {
        return {

        }
    }
)(ReportThemePage);