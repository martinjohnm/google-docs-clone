import { useRecoilValue } from "recoil"
import { userAtom } from "../store/auth/auth.state"
import { useUserLogout } from "../hooks/user/useUserLogout"


export const HomePage = () => {

    const user = useRecoilValue(userAtom)
    const {logoutUser} = useUserLogout()
    

    return <div>
        <div className="h-18 bg-slate-200 grid grid-cols-3 justify-center items-center">
            <div>

            </div>
            <div>

            </div>
            <div>
                <button onClick={logoutUser} className="bg-green-400 rounded-md p-2 hover:bg-green-600 cursor-pointer">Logout</button>
            </div>
        </div>
        <div className="max-w-7xl mx-auto container h-screen bg-slate-300 mt-10 p-10">
            <div className="w-full h-full">
                
                <p>{user.user?.email}</p>
                    
            </div>

            
            
        </div>
        
    </div>
}