import { CookieOptions } from "express";



export const CookieOption : CookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        }