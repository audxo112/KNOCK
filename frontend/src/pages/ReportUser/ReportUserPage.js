import React, {Component} from "react"
import {connect} from "react-redux"
import ReportUserTemplate from "./ReportUserTemplate"

class ReportUserPage extends Component{
    render() {
        return (
            <ReportUserTemplate
                searchForm={"검색"}
                filter={"필터"}
                sanctionsType={"제재 유형"}
                sanctionsPeriod={"제재 기간"}
                sanctionsConfirm={"제재확정"}
                reportUserList={"유저 리스트"}/>
        )
    }
}

export default connect(
    () => {
        return {

        }
    }
)(ReportUserPage);