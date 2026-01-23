import { prisma } from "@repo/db";
import { Room } from "./Room";
import { DocId } from "./RoomTypes";
import { reconstructorFromSnapshot } from "@repo/ot-core";




export async function loadRoomAndPermissionsFromDb(userIdFromDb : string, docId : DocId) : Promise<Room | null> {



    const existingDoc = await prisma.document.findUnique({
        where : {
            id : docId
        },
        include : {
            snapshots : {
                orderBy : {
                    version : "desc"
                }
            },
            members : {
                where : {
                    userId : userIdFromDb
                }
            }
        }
    })

    if (!existingDoc) {
        return null
    }
    

    const latestSnapshot = existingDoc.snapshots[0]

    if (!latestSnapshot) {
        
        return null
    }


    const operationsAfterLatestSnapshot = await prisma.operation.findMany({
        where : {
            documentId : existingDoc.id,
            version : {
                gt : latestSnapshot.version
            }
        }, 
        orderBy : {
            version : "desc"
        }
    })
    
    // transform the ops with snapshot to get the latest doc


    const documentData = reconstructorFromSnapshot(latestSnapshot, operationsAfterLatestSnapshot)
    


    return new Room(docId, documentData.doc, documentData.version)
}