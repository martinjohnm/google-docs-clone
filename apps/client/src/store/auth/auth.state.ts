
import { UserObjectFrontend } from "@repo/types/normal-types";
import { atom } from "recoil";

export interface User {
    user : UserObjectFrontend | null,
    loading : boolean,
    error : string | null
}

export const userAtom = atom<User>({
    key : "userAtom",
    default : {
        user : null,
        loading : true,
        error : null
    }
})