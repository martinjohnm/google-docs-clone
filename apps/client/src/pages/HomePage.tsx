import { useRecoilValue } from "recoil"
import { userAtom } from "../store/auth/auth.state"
import { useUserLogout } from "../hooks/user/useUserLogout"
import { useSocket } from "../hooks/socket/useSocket"
import { RoomType } from "@repo/types/ws-types"
import { useEffect } from "react"



export const HomePage = () => {

    const user = useRecoilValue(userAtom)
    const {logoutUser} = useUserLogout()
    const socket = useSocket()
    const init_room = () => {
        socket?.send(JSON.stringify({
            type : RoomType.INIT_ROOM
        }))
    }

    useEffect(() => {
        
        if (!socket) return
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log(message);
            
        }
    })

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
        <div className="max-w-7xl mx-auto container h-screen bg-slate-300">
            <div className="flex flex-col justify-center items-center">
                <p>{user.user?.email}</p>
                <button onClick={init_room} className="bg-green-300 p-2 rounded-md outline-1">create room</button>
            </div>


            
            
        </div>
        
    </div>
}