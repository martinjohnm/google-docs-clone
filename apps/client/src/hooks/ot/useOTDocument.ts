import { useEffect, useState } from "react";
import { OtClient } from "../../utils/OtClient";




export function useOTDocument(client: OtClient,initialDoc: string) {
  const [doc, setDoc] = useState(initialDoc);


  useEffect(() => {
    client.subscribe(setDoc)
    
  }, [client]);

  return doc;
}
