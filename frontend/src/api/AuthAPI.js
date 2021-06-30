import axios from "axios";
import { HOST, JSONConfig } from "./apiBase"

class AuthAPI {
    verifyToken = (
        token
    ) => {
        return axios.post(
            `${HOST}/api/token/verify/`, {
            token: token,
        }, JSONConfig()
        )
    }

    refreshToken = (
        token
    ) => {
        return axios.post(
            `${HOST}/api/token/refresh/`, {
            token: token,
        }, JSONConfig()
        )
    }

    googleLogin = (token) => {
        return axios.post(
            `${HOST}/api/users/rest-auth/google/editor/`, {
            access_token: token,
        }, JSONConfig()
        )
    }
}

export default new AuthAPI();