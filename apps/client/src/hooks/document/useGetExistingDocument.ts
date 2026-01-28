import axios from "axios"
import { useEffect, useState } from "react"
import { GET_DOC } from "../../urls/user.urls"


export const useGetExistingDocument = (id : string | null) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [document, setDocument] = useState<{doc : string, version : number} | null>(null)


    useEffect(() => {
        getDocument()
    },[])

    async function getDocument() {
        try {
            setLoading(true)
            setError(null)
            setDocument(null)

            const res = await axios.get(
                `${GET_DOC}/${id}`,
                {withCredentials : true}
            )
            
            setDocument(res.data.document)


        } catch(e : any) {
            setError(e)
            return null
        } finally {
            setLoading(false)
        }
    }

    return {loading, document, error }
}