import { useEffect, useState } from "react";
import { OtClient } from "../../utils/OtClient";




export function useOTDocument(client: OtClient) {
  const [doc, setDoc] = useState("");


  useEffect(() => {
    client.subscribe(setDoc)
    
  }, [client]);

  return doc;
}
