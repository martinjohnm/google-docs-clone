import { UserLoginInput } from "@repo/types/zod-types"
import axios from "axios"
import { useState } from "react"
import { LOGIN_USER } from "../../urls/user.urls"
import { useSetRecoilState } from "recoil"
import { userAtom } from "../../store/auth/auth.state"



export const useUserLogin = () => {
    
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null> (null)
    const setUser = useSetRecoilState(userAtom)

    async function loginUser(inputs : UserLoginInput) {
        try {
            setLoading(true)
            setError(null)

            const res = await axios.post(
                LOGIN_USER,
                inputs,
                { withCredentials : true }
            );

            console.log(res.data);
            setUser(res.data.user)
            window.location.href = "/"

        } catch(err  :any) {    
            setError(err)
            console.log(err.response.data.message);
            
            return null
        } finally {
            setLoading(false)
        }
    }

    return { loginUser, loading, error}
}