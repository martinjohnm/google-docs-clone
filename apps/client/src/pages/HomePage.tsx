import { useRecoilValue } from "recoil"
import { userAtom } from "../store/auth/auth.state"
import { useUserLogout } from "../hooks/user/useUserLogout"
import { useSocket } from "../hooks/socket/useSocket"
import { MESSAGE_INPUT_TYPE, MESSAGE_OUTPUT_TYPE, RoomOutputType, RoomType } from "@repo/types/ws-types"
import React, { useEffect, useRef, useState } from "react"
import { getTextOperation } from "../utils/getDiff"
import { OpType } from "@repo/types/ot-types"



export const HomePage = () => {

    const user = useRecoilValue(userAtom)
    const {logoutUser} = useUserLogout()
    const socket = useSocket()
    const init_room = () => {
        socket?.send(JSON.stringify({
            type : RoomType.INIT_ROOM
        }))
    }

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

    const [roomIdForJoining, setRoomIdForJoining] = useState<string | null>(null)
    const [rev, setRev] = useState<number>(0)

    const handleRoomIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomIdForJoining(e.target.value)
    }

    const [room, setRoom] = useState<string | null>(null)

    useEffect(() => {
        
        if (!socket) return
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data) as MESSAGE_OUTPUT_TYPE
            
            if (message.type === RoomOutputType.ROOM_CREATED) {
                setRoom(message.data.roomId)
            }

            if (message.type === RoomOutputType.USER_JOINDED) {
                setRoom(message.data.roomId)
            }

            if (message.type === OpType.INSERT) {
                console.log(message);
                setRev(message.data.rev)
            }
            if (message.type === OpType.DELETE) {
                console.log(message);
                setRev(message.data.rev)
            }
            
        }
    }, [socket])


    const [value, setValue] = useState("")
    const prevValueRef = useRef(value)
    
    function handleChange(e : React.ChangeEvent<HTMLTextAreaElement>) {
        const newValue = e.target.value
        const oldValue = prevValueRef.current

        const op = getTextOperation(oldValue, newValue)

        if (op) {



            socket?.send(JSON.stringify({
                type : OpType.INSERT,
                data : {
                    roomId : room,
                    op : {
                        ...op,
                        rev
                    }
                }
            } as MESSAGE_INPUT_TYPE) )
        }

        

        prevValueRef.current = newValue
        setValue(newValue)
    }



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
                { !room ? <div className="flex flex-col justify-center items-center">
                    <p>{user.user?.email}</p>
                    <button onClick={init_room} className="bg-green-300 p-2 rounded-md outline-1">create room</button>
                    <p>Or</p>
                    <div >
                        <input onChange={handleRoomIdInput} className="bg-slate-200" type="text" />
                        <button onClick={join_room}>Join Room</button>
                    </div>
                </div> : <div className="flex flex-col justify-center items-center">
                        <p>{`roomId = ${room}`}</p>
                        
                        <textarea onChange={handleChange} className="bg-slate-100 outline-none p-1 w-full h-[600px]" name="" id="">

                        </textarea>
                    </div>
                }
            </div>

            
            
        </div>
        
    </div>
}