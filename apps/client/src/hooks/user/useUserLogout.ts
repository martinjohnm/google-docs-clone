import { useState } from "react"
import { useSetRecoilState } from "recoil"
import { userAtom } from "../../store/auth/auth.state"
import axios from "axios"
import { LOGOUT_USER } from "../../urls/user.urls"



export const useUserLogout = () => {

    const [logoutLoading, setLogoutLoading] = useState<boolean>(false)
    const [logoutError, setLogoutError] = useState<string | null>(null)
    const setUser = useSetRecoilState(userAtom)

    async function logoutUser() {
        try {
            setLogoutLoading(true)
            setLogoutError(null)
            const res = await axios.post(
                LOGOUT_USER,
                {},
                { 
                    withCredentials : true
                }
            )

            console.log(res.data);
            

            setUser({
                user : null,
                loading : false,
                error : null
            })


        } catch(err : any) {
            setLogoutError(err)
            console.log(err.response.data.message);
            
            return null
        } finally {
            setLogoutLoading(false)
        }
    }

    return { logoutUser, logoutLoading, logoutError }
}