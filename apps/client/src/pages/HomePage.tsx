
import { useUserLogout } from "../hooks/user/useUserLogout"
import { useCreateNewDocument } from "../hooks/document/useCreateNewDocument"



export const HomePage = () => {

    const {logoutUser} = useUserLogout()
    const { createNewDocument, loading, docId } = useCreateNewDocument()

  
    const loc = window.location.href


    if (docId) {
        window.open(`${loc}document/${docId}`, "_blank", "noopener,noreferrer");
    }

    const init_room = () => {
        createNewDocument()
    }

    const join_room = () => {

        // if (socket && roomIdForJoining){
        //     socket.send(JSON.stringify({
        //         type : RoomType.JOIN_ROOM,
        //         data : {
        //             roomId : roomIdForJoining
        //         }
        //     } as MESSAGE_INPUT_TYPE))
        // }
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
                
                <div>   
                    <button onClick={init_room} className="bg-green-300 outline-none border-2">Create Room</button>
                    <p>Or</p>
                    <div >
                        <input onChange={() => null} className="bg-slate-200" type="text" />
                        <button onClick={join_room}>Join Room</button>
                    </div>
                </div>
                
                
                    
            </div>

            
            
        </div>
        
    </div>
}