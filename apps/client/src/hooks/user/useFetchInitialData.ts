import { useEffect } from "react"
import { useSetRecoilState } from "recoil"
import { userAtom } from "../../store/auth/auth.state"
import axios from "axios"
import { GET_USER } from "../../urls/user.urls"
import { UNPROCESSABLE_ENTITY } from "@repo/types/http-types"


export const useFetchInitialData = () => {
    const setAuth = useSetRecoilState(userAtom);

  useEffect(() => {
    async function loadUser() {
      setAuth(prev => ({ ...prev, loading: true }));

      try {
        const res = await axios.get(GET_USER, {
          withCredentials: true
        });

        setAuth({
          user: res.data.user,
          loading: false,
          error: null
        });

      } catch (err: any) {

        

        setAuth({
          user: null,
          loading: false,
          error: err.response?.data?.message || "Not authenticated"
        });

        if (err.response.data.status === UNPROCESSABLE_ENTITY) {
            console.log(err.response.data.message);
            window.location.href = "/login"

        } else  {
            console.log(err.response.data.message)
            window.location.href = "/login"

        }
      }
    }

    loadUser();
  }, []);
}