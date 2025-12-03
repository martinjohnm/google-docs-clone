import { useRecoilValue } from "recoil"
import { userAtom } from "../store/auth/auth.state"



export const HomePage = () => {

    const user = useRecoilValue(userAtom)
    return <div>
        <p>{user.user?.email}</p>
    </div>
}