import { combineReducers } from "redux";
import popup from "./popup"
import auth from "./auth"
import themeUpload from "./themeUpload";
import themeList from "./themeList";
import frameUpload from "./frameUpload";
import frameList from "./frameList";
import curationGroupUpload from "./curationGroupUpload";
import curationGroupEdit from "./curationGroupEdit";
import curationFolderUpload from "./curationFolderUpload";
import curationFolderEdit from "./curationFolderEdit";
import curationThemeUpload from "./curationThemeUpload";
import curationThemeEdit from "./curationThemeEdit";
import reportUser from "./reportUser";
import reportTheme from "./reportTheme";
import popularity from "./popularity";
import editorUserRegister from "./editorUserRegister";
import editorUserEdit from "./editorUserEdit";
import editorUserBanNickname from "./editorUserBanNickname";

export default combineReducers({
    popup,
    auth,
    themeUpload,
    themeList,
    frameUpload,
    frameList,
    curationGroupUpload,
    curationGroupEdit,
    curationFolderUpload,
    curationFolderEdit,
    curationThemeUpload,
    curationThemeEdit,
    reportUser,
    reportTheme,
    popularity,
    editorUserRegister,
    editorUserEdit,
    editorUserBanNickname,
});