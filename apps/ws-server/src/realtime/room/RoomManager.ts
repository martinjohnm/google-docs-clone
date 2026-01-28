import { Room } from "./Room.js";
import { Op } from "@repo/types/ot-types";
import { Role } from "@repo/db";
import { User } from "../../auth/User.js";
import { DocId, JoinRoomResult, UserId } from "./RoomTypes.js";
import { createRoomAndLoadPermissionsFromDb, loadUserRoleFromDb } from "./RoomFactory.js";




export class RoomManager {
    
    private static instance : RoomManager
    private docIdToRoomMap: Map<DocId, Room>
    // access cache maping { Room1: { User1 : Role, User2 : Role ..., etc }, Room2 : { User3 : Role, User2 : Role ..., etc } .. and so on }
    private accessCache : Map<DocId, Map<UserId, Role>>

    private constructor() {
        this.docIdToRoomMap = new Map()
        // this.users = []
        this.accessCache = new Map()
    }

   

    static getInstance() {
        if (RoomManager.instance) {
            return RoomManager.instance
        }

        RoomManager.instance = new RoomManager();
        return RoomManager.instance
    }

   

    removeRoom(docId: DocId) {
        if (this.docIdToRoomMap.has(docId)) {
            this.docIdToRoomMap.delete(docId)
        }
    }

    addToAccessCache(user: User, docId: DocId, role : Role) {
        if (this.accessCache.has(docId)) {
            const existingUserRoles = this.accessCache.get(docId)
            if (!existingUserRoles) return

            if (existingUserRoles.has(user.userIdFromDb)) {
                return
            } else {
                existingUserRoles.set(user.userIdFromDb, role)
            }
            this.accessCache.set(docId, existingUserRoles)
        } else {
            const userRoleMap = new Map()
            userRoleMap.set(user.userIdFromDb, role)
            this.accessCache.set(docId, userRoleMap)
        }

    }



    async createOrJoinRoom(user: User, docId : string) : Promise<JoinRoomResult> {
        if (!this.docIdToRoomMap.has(docId)) {
            const roomAndUserRole = await createRoomAndLoadPermissionsFromDb(user.userIdFromDb, docId)
            const room = roomAndUserRole?.room
            const role = roomAndUserRole?.role
            if (!room || !role) {
                return {
                    ok: false,
                    reason: "ACCESS_DENIED"
                }
            }

            this.docIdToRoomMap.set(docId, room)
            this.addToAccessCache(user, docId, role)
            return {
                ok : true,
                doc : room.doc,
                version: room.rev,
                roomId : room.roomId
            }
        } else {
            const userRole = await loadUserRoleFromDb(user.userIdFromDb, docId)
            const role = userRole
            if (!role)  {
                return {
                    ok: false,
                    reason: "ACCESS_DENIED"
                }
            }

            const room = this.docIdToRoomMap.get(docId)

            if (!room)  {
                return {
                    ok: false,
                    reason: "ACCESS_DENIED"
                }
            }

            this.addToAccessCache(user, docId, role)
            return {
                ok : true,
                doc : room.doc,
                version: room.rev,
                roomId : room.roomId
            }
        }
        
        
    }


    receiveOp(roomId : string, op : Op) {
        const room = this.docIdToRoomMap.get(roomId)
                        
        
        if (!room) {
            console.error("No such room present!")
            return
        }

        return room.receiveOp(op)
    }

}

export const roomManager = RoomManager.getInstance()