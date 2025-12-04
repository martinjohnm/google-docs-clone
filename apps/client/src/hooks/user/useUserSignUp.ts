import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../../store/auth/auth.state";
import { UserCreationInput } from "@repo/types/zod-types";
import axios from "axios";
import { SIGNUP_USER } from "../../urls/user.urls";



export const useUserSignUp = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null> (null)
    const setAuth = useSetRecoilState(userAtom);

    async function signupUser(inputs : UserCreationInput) {
        try {
            setLoading(true)
            setError(null)
            setAuth(prev => ({ ...prev, loading: true }));

            const res = await axios.post(
                SIGNUP_USER,
                inputs,
                { withCredentials : true }
            );

            console.log(res.data);
            setAuth({
                user : res.data.user,
                loading : false,
                error : null
            })


        } catch(err  :any) {    
            setAuth({
                user: null,
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

    return { signupUser, loading, error}
}