export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;

export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-info`;
export const UPLOAD_PROFILE_IMAGE = `${AUTH_ROUTES}/upload-profile-image`;
export const DELETE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`;
