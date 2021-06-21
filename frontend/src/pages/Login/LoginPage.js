import React, { Component } from "react";
import { connect } from "react-redux";

import LoginTemplate from "./LoginTemplate"
import { GoogleLoginButton } from "components/LoginButton"

import { googleLogin, login } from "service/authService";
import { STATUS_LOADING } from "const/auth"

class LoginPage extends Component {
    handleSuccess = (result) => {
        googleLogin(result.accessToken)
    }

    render() {
        const { loading, status } = this.props

        return <LoginTemplate
            loading={loading}
            status={status}
            googleLogin={
                // <GoogleLoginButton
                //     clientId="983851189873-ir4o84m068oc2kqrf5svbjg74m0jhmfe.apps.googleusercontent.com"
                //     loading={status === STATUS_LOADING}
                //     onSuccess={this.handleSuccess} />

                <button onClick={() => {
                    login()
                }}>로그인</button>
            }
        />
    }
}

export default connect(
    ({ auth }) => {
        return {
            loading: auth.loading,
            status: auth.status
        }
    }
)(LoginPage);
