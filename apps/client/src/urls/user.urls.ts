
const BE_URL = import.meta.env.VITE_APP_BACKEND_URL

export const GET_USER = `${BE_URL}/auth/me`
export const LOGIN_USER = `${BE_URL}/auth/login-local`
export const SIGNUP_USER = `${BE_URL}/auth/signup-local`
export const LOGOUT_USER = `${BE_URL}/auth/logout`
