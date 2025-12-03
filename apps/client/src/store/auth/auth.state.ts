
import { UserObjectFrontend } from "@repo/types/normal-types";
import { atom } from "recoil";


export const userAtom = atom<UserObjectFrontend | null>({
    key : "userAtom",
    default : {
        id : "i",
        name : "n",
        email : "joh",
        username : "jojo",
        createdAt : new Date(),
        lastLogin : new Date()
    }
})