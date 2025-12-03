
import { useState } from "react"
import { GET_USER } from "../../urls/user.urls";
import axios from "axios";


export const useAuthInit = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null> (null)

    async function loadUser() {
        
        try {
            setLoading(true)
            setError(null)

            const res = await axios.get(
                GET_USER,
                { withCredentials : true }
            );

            console.log(res.data);


            window.location.href = "/"

        } catch(err  :any) {    
            setError(err)
            console.log(err.response.data.message);
            
            return null
        } finally {
            setLoading(false)
        }
    }
    
    return { loadUser, loading, error }
}