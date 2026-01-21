
import { useUserLogout } from "../hooks/user/useUserLogout"
import { useSocket } from "../hooks/socket/useSocket"
import { useNavigate, useParams } from "react-router"
import { DocumentEditComponent } from "../components/DocumentEditComponent"
import { useGetExistingDocument } from "../hooks/document/useGetExistingDocument"
import { useEffect } from "react"


export const DocumentPage = () => {
    const params = useParams()
    const socket = useSocket()
    const {logoutUser} = useUserLogout()
    const navi = useNavigate()

    useEffect(() => {
    
        if (!params.id) {
            navi("/")
        }
    
    }, [socket, params])
    
    const {document} = useGetExistingDocument(params.id ?? "")
  

    console.log(document);
    
    



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
                
                {/* <DocumentEditComponent room={room} socket={socket} initialDoc={initialDoc} initialVersion={initialVersion}/> */}
            
            </div>

            
            
        </div>
        
    </div>
}