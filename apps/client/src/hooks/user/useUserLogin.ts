import { UserLoginInput } from "@repo/types/zod-types"
import axios from "axios"
import { useState } from "react"
import { LOGIN_USER } from "../../urls/user.urls"
import { useSetRecoilState } from "recoil"
import { userAtom } from "../../store/auth/auth.state"



export const useUserLogin = () => {
    
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null> (null)
    const setAuth = useSetRecoilState(userAtom);

    async function loginUser(inputs : UserLoginInput) {
        try {
            setLoading(true)
            setError(null)
            setAuth(prev => ({ ...prev, loading: true }));

            const res = await axios.post(
                LOGIN_USER,
                inputs,
                { withCredentials : true }
            );

            console.log(res.data);
            setAuth({
                user : res.data.user,
                token : res.data.token,
                loading : false,
                error : null
            })

            

        } catch(err  :any) {    
            setAuth({
                user: null,
                token : null,
                loading: false,
                error: err.response?.data?.message || "Not authenticated"
            });
            setError(err)
            console.log(err.response.data.message);
            
            return null
        } finally {
            setLoading(false)
        }
    }

    return { loginUser, loading, error}
}