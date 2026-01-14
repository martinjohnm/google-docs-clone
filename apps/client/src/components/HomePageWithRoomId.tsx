import { nanoid } from "nanoid"
import { useOTDocument } from "../hooks/ot/useOTDocument"
import { diffToOp } from "../utils/getDiff"
import { OtClient } from "../utils/OtClient"
import { OtTransport } from "../utils/OtTransport"
import { useRef } from "react"


export const HomePageWithROomId  = ({room, wss} : {room : string, wss : WebSocket}) => {


    

    const otClientRef = useRef<OtClient>()

    if (!otClientRef.current) {
        otClientRef.current = new OtClient("",0,room, nanoid())
    }
    const doc = useOTDocument(otClientRef.current)
    const transport = new OtTransport(wss, otClientRef.current)

    function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const newText = e.target.value
        
        let op = diffToOp(doc, newText)

        if (!op) return

        if (!otClientRef.current) return

        op = {
            ...op,
            clientId : otClientRef.current.id,
            rev : otClientRef.current.version,
            
        }

        transport.sendLocal(op)

    }


    return <div className="flex flex-col justify-center items-center">
                <p>{`roomId = ${room}`}</p>
                
                <textarea onChange={onChange} value={doc}  className="bg-slate-100 outline-none p-1 w-full h-[600px]" name="" id="">

                </textarea>
            </div>
}