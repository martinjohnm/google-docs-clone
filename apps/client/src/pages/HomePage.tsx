import { useRecoilValue } from "recoil"
import { userAtom } from "../store/auth/auth.state"
import { useUserLogout } from "../hooks/user/useUserLogout"
import { useEffect, useState } from "react"
import { HomePageWithROomId } from "../components/HomePageWithRoomId"
import { useSocket } from "../hooks/socket/useSocket"
import { MESSAGE_INPUT_TYPE, MESSAGE_OUTPUT_TYPE, RoomOutputType, RoomType } from "@repo/types/ws-types"


export const HomePage = () => {

    const user = useRecoilValue(userAtom)
    const {logoutUser} = useUserLogout()
    const [room , setRoom] = useState<string | null>(null)

    const socket = useSocket()

    const init_room = () => {
        socket?.send(JSON.stringify({
            type : RoomType.INIT_ROOM
        } as MESSAGE_INPUT_TYPE))
    }

    const [initialDoc, setInitalDoc] = useState<string | null>(null)
    const [initialVersion, setInitialVersion] = useState<number | null>(null)

    const join_room = () => {

        if (socket && roomIdForJoining){
            socket.send(JSON.stringify({
                type : RoomType.JOIN_ROOM,
                data : {
                    roomId : roomIdForJoining
                }
            } as MESSAGE_INPUT_TYPE))
        }
    }

    useEffect(() => {
        
        if (!socket) return
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data) as MESSAGE_OUTPUT_TYPE
            
            if (message.type === RoomOutputType.ROOM_CREATED) {
                console.log("room created", message);
                
                setRoom(message.data.roomId)
                setInitalDoc(message.data.doc)
                setInitialVersion(message.data.version)
            }

            if (message.type === RoomOutputType.USER_JOINDED) {
                console.log("user joined", message);
                setRoom(message.data.roomId)
                setInitalDoc(message.data.doc)
                setInitialVersion(message.data.version)
            }

        }
    }, [socket])
    

    const [roomIdForJoining, setRoomIdForJoining] = useState<string | null>(null)

     const handleRoomIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomIdForJoining(e.target.value)
    }

    if (!socket) return <div>Loading....</div>


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
                
                {(room === null || initialDoc === null || initialVersion === null) ? (
                <div>   
                    <button onClick={init_room} className="bg-green-300 outline-none border-2">Create Room</button>
                    <p>Or</p>
                    <div >
                        <input onChange={handleRoomIdInput} className="bg-slate-200" type="text" />
                        <button onClick={join_room}>Join Room</button>
                    </div>
                </div>
                
                ) : (
                <HomePageWithROomId room={room} socket={socket} initialDoc={initialDoc} initialVersion={initialVersion}/>
            )}
                    
            </div>

            
            
        </div>
        
    </div>
}