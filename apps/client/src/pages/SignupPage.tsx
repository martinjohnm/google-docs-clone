import { useRecoilValue } from "recoil"
import { userAtom } from "../store/auth/auth.state"



export const SignupPage = () => {

    const user = useRecoilValue(userAtom)

    return <div>
        <p className="text-black">{user?.email}</p>
    </div>
}