
import { useUserLogout } from "../hooks/user/useUserLogout"
import { useSocket } from "../hooks/socket/useSocket"
import { useNavigate, useParams } from "react-router"
import { DocumentEditComponent } from "../components/DocumentEditComponent"
import { useGetExistingDocument } from "../hooks/document/useGetExistingDocument"
import { useEffect } from "react"
import { MESSAGE_INPUT_TYPE, RoomType } from "@repo/types/ws-types"


export const DocumentPage = () => {
    const params = useParams()
    const socket = useSocket()
    const {logoutUser} = useUserLogout()
    const navi = useNavigate()

   
    const {document} = useGetExistingDocument(params.id ?? "")
      
    
    useEffect(() => {
    
        if (!params.id) {
            navi("/")
        }
        
        if (!socket) return

        socket.send(
            JSON.stringify({
                type : RoomType.INIT_ROOM,
                data : {
                    docId : params.id
                }
            } as MESSAGE_INPUT_TYPE)
        )

    }, [socket, params])
    


    return (
    (!socket || !document) ?  (
    <div>
        Loading
    </div>
        ) : (
            
    <div>
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
                
                <DocumentEditComponent room={params.id ?? ""} socket={socket} initialDoc={document.doc} initialVersion={document.version}/> 
            
            </div>

            
            
        </div>
        
    </div>)
    )
}