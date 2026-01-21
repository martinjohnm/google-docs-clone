import axios from "axios"
import { useState } from "react"
import { CREATE_DOC } from "../../urls/user.urls"



export const useCreateNewDocument = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [_error, setError] = useState<string | null>(null)
    const [docId, setDocId] = useState<string | null>(null)

    async function createNewDocument() {
        try {
            setLoading(true)
            setError(null)
            setDocId(null)

            const res = await axios.post(
                CREATE_DOC,
                null, 
                {withCredentials : true}
            )

            console.log(res.data);
            
            setDocId(res.data.documentId)


        } catch(e : any) {
            setError(e)
            return null
        } finally {
            setLoading(false)
        }
    }

    return { createNewDocument, loading, docId }

}