import React, { Component } from 'react';
import { connect } from "react-redux";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import { verifyToken } from "service/authService";

import {
    LoginPage,
    ThemeUploadPage,
    ThemeListPage,
    FrameUploadPage,
    FrameListPage,
    CurationGroupUploadPage,
    CurationGroupEditPage,
    CurationFolderUploadPage,
    CurationFolderEditPage,
    CurationThemeUploadPage,
    CurationThemeEditPage,
    ReportUserPage,
    ReportThemePage,
    PopularityPage,
    EditorUserRegisterPage,
    EditorUserEditPage,
    EditorUserBanNicknamePage,
} from "pages";

import Nav from "components/Nav";
import ModalPage from "pages/Modal";

import { STATUS_AUTH } from "const/auth"

class App extends Component {
    componentDidMount() {
        verifyToken()
    }

    renderIsNotAuthPage() {
        return <>
            <Route path="/" component={LoginPage} />
        </>
    }

    renderIsAuthPage() {
        return <>
            <Route path="/" component={Nav} />
            <Switch>
                <Route exact path="/theme/upload" component={ThemeUploadPage} />
                <Route exact path="/theme/list" component={ThemeListPage} />
                <Route path="/theme">
                    <Redirect to="/theme/upload" />
                </Route>

                <Route exact path="/frame/upload" component={FrameUploadPage} />
                <Route exact path="/frame/list" component={FrameListPage} />
                <Route path="/frame">
                    <Redirect to="/frame/upload" />
                </Route>

                <Route exact path="/curation/group/upload" component={CurationGroupUploadPage} />
                <Route exact path="/curation/group/edit" component={CurationGroupEditPage} />
                <Route path="/curation/group">
                    <Redirect to="/curation/group/upload" />
                </Route>
                <Route exact path="/curation/folder/upload" component={CurationFolderUploadPage} />
                <Route exact path="/curation/folder/edit" component={CurationFolderEditPage} />
                <Route path="/curation/folder">
                    <Redirect to="/curation/folder/upload" />
                </Route>
                <Route exact path="/curation/theme/upload" component={CurationThemeUploadPage} />
                <Route exact path="/curation/theme/edit" component={CurationThemeEditPage} />
                <Route path="/curation/theme">
                    <Redirect to="/curation/theme/upload" />
                </Route>
                <Route path="/curation">
                    <Redirect to="/curation/group/upload" />
                </Route>

                <Route exact path="/report/user" component={ReportUserPage} />
                <Route exact path="/report/theme" component={ReportThemePage} />
                <Route path="/report">
                    <Redirect to="/report/user" />
                </Route>

                <Route exact path="/popularity" component={PopularityPage} />
                <Route path="/popularity">
                    <Redirect to="/popularity" />
                </Route>

                <Route exact path="/user/register" component={EditorUserRegisterPage} />
                <Route exact path="/user/edit" component={EditorUserEditPage} />
                <Route exact path="/user/ban-nickname" component={EditorUserBanNicknamePage} />
                <Route path="/user">
                    <Redirect to="/user/register" />
                </Route>

                <Route exact path="/">
                    <Redirect to="/theme/upload" />
                </Route>
                <Redirect to="/" />
            </Switch>
        </>
    }

    render() {
        const { status } = this.props
        return (<BrowserRouter>
            {status === STATUS_AUTH ?
                this.renderIsAuthPage() :
                this.renderIsNotAuthPage()}
            <ModalPage />
        </BrowserRouter>);
    }
}

export default connect(
    ({ auth }) => {
        return {
            status: auth.status
        }
    }
)(App);
