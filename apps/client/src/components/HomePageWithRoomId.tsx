import { nanoid } from "nanoid"
import { useOTDocument } from "../hooks/ot/useOTDocument"
import { diffToOp } from "../utils/getDiff"
import { OtClient } from "../utils/OtClient"
import { OtTransport } from "../utils/OtTransport"
import { useRef } from "react"


export const HomePageWithROomId  = ({room, socket, initialDoc, initialVersion} : {room : string, socket : WebSocket, initialDoc : string, initialVersion : number}) => {


    // console.log(`initDoc=${initialDoc} initVer=${initialVersion} roomId=${room }`);

    const otClientRef = useRef<OtClient>()

    if (!otClientRef.current) {
        otClientRef.current = new OtClient(initialDoc,initialVersion,room, nanoid())
    }
    const doc = useOTDocument(otClientRef.current, initialDoc)
    console.log(doc);
    
    const transport = new OtTransport(socket, otClientRef.current)

    function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const newText = e.target.value
        
        let op = diffToOp(doc, newText)

        if (!op) return

        if (!otClientRef.current) return

        op = {
            ...op,
            clientId : otClientRef.current.id,
            rev : otClientRef.current.version,
            id : nanoid()
        }

        

        transport.sendLocal(op)

    }


    return <div className="flex flex-col justify-center items-center">
                <p>{`roomId = ${room}`}</p>
                
                <textarea onChange={onChange} value={doc} className="bg-slate-100 outline-none p-1 w-full h-[600px]" name="" id="">

                </textarea>
            </div>
}