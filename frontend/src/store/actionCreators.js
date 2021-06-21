import { bindActionCreators } from 'redux';
import * as popup from "./modules/popup";
import * as auth from "./modules/auth";
import * as themeUpload from "./modules/themeUpload";
import * as themeList from "./modules/themeList";
import * as frameUplaod from "./modules/frameUpload";
import * as frameList from "./modules/frameList";
import * as curationGroupUpload from "./modules/curationGroupUpload";
import * as curationGroupEdit from "./modules/curationGroupEdit";
import * as curationFolderUpload from "./modules/curationFolderUpload";
import * as curationFolderEdit from "./modules/curationFolderEdit";
import * as curationThemeUpload from "./modules/curationThemeUpload";
import * as curationThemeEdit from "./modules/curationThemeEdit";
import * as editorUserRegister from "./modules/editorUserRegister";
import * as editorUserEdit from "./modules/editorUserEdit";
import * as editorUserBanNickname from "./modules/editorUserBanNickname";
import * as reportUser from "./modules/reportUser";
import * as reportTheme from "./modules/reportTheme";
import * as popularity from "./modules/popularity";

import store from "./index";

const { dispatch } = store;

export const PopupActions = bindActionCreators(popup, dispatch);
export const AuthActions = bindActionCreators(auth, dispatch);
export const ThemeUploadActions = bindActionCreators(themeUpload, dispatch);
export const ThemeListActions = bindActionCreators(themeList, dispatch);
export const FrameUploadActions = bindActionCreators(frameUplaod, dispatch);
export const FrameListActions = bindActionCreators(frameList, dispatch);
export const CurationGroupUploadActions = bindActionCreators(curationGroupUpload, dispatch);
export const CurationGroupEditActions = bindActionCreators(curationGroupEdit, dispatch);
export const CurationFolderUploadActions = bindActionCreators(curationFolderUpload, dispatch);
export const CurationFolderEditActions = bindActionCreators(curationFolderEdit, dispatch);
export const CurationThemeUploadActions = bindActionCreators(curationThemeUpload, dispatch);
export const CurationThemeEditActions = bindActionCreators(curationThemeEdit, dispatch);
export const EditorUserRegisterActions = bindActionCreators(editorUserRegister, dispatch);
export const EditorUserEditActions = bindActionCreators(editorUserEdit, dispatch);
export const EditorUserBanNicknameActions = bindActionCreators(editorUserBanNickname, dispatch);
export const ReportUserActions = bindActionCreators(reportUser, dispatch);
export const ReportThemeActions = bindActionCreators(reportTheme, dispatch);
export const PopularityActions = bindActionCreators(popularity, dispatch);