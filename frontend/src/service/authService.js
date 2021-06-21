import {
    PopupActions,
    AuthActions
} from "store/actionCreators"
import {authAPI} from "api"
import {
    STATUS_AUTH,
    STATUS_NOT_AUTH,
    STATUS_LOADING,
} from "const/auth"

export const googleLogin = (token) =>{
    AuthActions.changeStatus(STATUS_LOADING)
    authAPI.googleLogin(
        token
    ).then(({data})=>{
        localStorage.setItem("token", data.token)
        AuthActions.changeStatus(STATUS_AUTH)
        PopupActions.showMessage("로그인에 성공했습니다.")
    }).catch((e)=>{
        AuthActions.changeStatus(STATUS_NOT_AUTH)
        PopupActions.showMessage("로그인에 실패했습니다.")
    })
}

export const login = () => {
    localStorage.setItem("token", "login")
    AuthActions.changeStatus(STATUS_AUTH)
}

export const logout = () => {
    localStorage.removeItem("token")
    AuthActions.changeStatus(STATUS_NOT_AUTH)
}

var loader;

const startPageLoading = () => {
    loader = setTimeout(()=>{
        AuthActions.changeLoading(true)
    }, 500) 
}

const stopPageLoading = () => {
    if(loader)
        clearTimeout(loader)
    AuthActions.changeLoading(false)
}

export const refreshToken = () => {
    const token = localStorage.getItem("token")
    if (token){
        authAPI.refreshToken(
            token
        ).then(({data}) => {
            stopPageLoading()

            localStorage.setItem("token", data.token)
            AuthActions.changeStatus(STATUS_AUTH)
        }).catch(()=>{
            stopPageLoading()

            localStorage.removeItem("token")
            AuthActions.changeStatus(STATUS_NOT_AUTH)
        })
    }
    else{
        AuthActions.changeStatus(STATUS_NOT_AUTH)
    }
}

export const verifyToken = () => {
    const token = localStorage.getItem("token")
    if(token) {
        startPageLoading()   

        authAPI.verifyToken(
            token
        ).then(({data}) => {
            stopPageLoading()
        
            localStorage.setItem("token", data.token)
            AuthActions.changeStatus(STATUS_AUTH)
        }).catch(()=>{
            refreshToken()
        })
    }
    else{
        AuthActions.changeStatus(STATUS_NOT_AUTH)
    }
}
