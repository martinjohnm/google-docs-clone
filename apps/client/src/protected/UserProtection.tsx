
import React  from "react"
import { useRecoilValue } from "recoil"
import { userAtom } from "../store/auth/auth.state"
import { Navigate } from "react-router"

export const UserProtection = ({ children } : { children : React.ReactNode }) => {

    const user = useRecoilValue(userAtom)

    if (user.loading) {
        <div>Loading...</div>
    }
    if (!user.user) {
        return <Navigate to={"/login"}/>
    }
    return children
    
}