import { prisma, Role } from "@repo/db";
import { Room } from "./Room";
import { DocId } from "./RoomTypes";
import { reconstructorFromSnapshot } from "@repo/ot-core";

interface RoomAndUserRole {
    room : Room,
    role : Role
}


export async function createRoomAndLoadPermissionsFromDb(userIdFromDb : string, docId : DocId) : Promise<RoomAndUserRole | null> {



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

    if (!existingDoc || !existingDoc.members[0]?.role) {
        return null
    }
    
    // reconstructing document from snapshot and ops
    const latestSnapshot = existingDoc.snapshots[0]

    if (!latestSnapshot) {
        
        return null
    }


    const operationsAfterLatestSnapshot = await prisma.operation.findMany({
        where : {
            documentId : existingDoc.id,
            version : {
                gte : latestSnapshot.version
            }
        }, 
        orderBy : {
            version : "desc"
        }
    })
    
    // transform the ops with snapshot to get the latest doc


    const documentData = reconstructorFromSnapshot(latestSnapshot, operationsAfterLatestSnapshot)
    


    return {
        room : new Room(docId, documentData.doc, documentData.version),
        role : existingDoc.members[0]?.role
    }
}

export async function loadUserRoleFromDb(userIdFromDb: string, docId : string) : Promise<Role | null> {

    const docMember = await prisma.documentMember.findFirst({
        where : {
            documentId : docId,
            userId : userIdFromDb
        }
    })

    if (!docMember) return null

    return docMember.role
}