import { MESSAGE_INPUT_TYPE, RoomOutputType, RoomType } from "@repo/types/ws-types";
import { Room } from "./Room.js";
import { OpType } from "@repo/types/ot-types";
import { socketManager } from "../socket/SocketManager.js";
import { Role } from "@repo/db";
import { User } from "../../auth/User.js";
import { DocId, RoomId, UserId } from "./RoomTypes.js";
import { createRoomAndLoadPermissionsFromDb, loadUserRoleFromDb } from "./RoomFactory.js";




export class RoomManager {
    
    private docIdToRoomMap: Map<DocId, Room>
    // access cache maping { Room1: { User1 : Role, User2 : Role ..., etc }, Room2 : { User3 : Role, User2 : Role ..., etc } .. and so on }
    private accessCache : Map<DocId, Map<UserId, Role>>

    constructor() {
        this.docIdToRoomMap = new Map()
        // this.users = []
        this.accessCache = new Map()
    }

    addUser(user: User) {
        this.addHandler(user)
    }

    removeUser(user: User) {  
        socketManager.removeUser(user,)
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


    private addHandler(user: User) {
        user.socket.on("message", async (data) => {
            const message = JSON.parse(data.toString()) as MESSAGE_INPUT_TYPE

            const docId = message.data.docId

            if (message.type == RoomType.INIT_ROOM) {
                
                if (!this.docIdToRoomMap.has(docId)) {
                    
                    const roomAndUserRole = await createRoomAndLoadPermissionsFromDb(user.userIdFromDb, docId)
                    const room = roomAndUserRole?.room
                    const role = roomAndUserRole?.role
                    if (!room || !role) {
                        
                        return
                    }

                    this.docIdToRoomMap.set(docId, room)
                    this.addToAccessCache(user, docId, role)
                    console.log(this.accessCache, "init");
                    

                    socketManager.addUser(user, docId)
                    socketManager.broadCast(docId, {
                        type : RoomOutputType.ROOM_CREATED,
                        data : {
                            roomId : docId,
                            doc : room.doc,
                            version : room.rev
                        }
                    })
                } else {
                    const userRole = await loadUserRoleFromDb(user.userIdFromDb, docId)
                    const role = userRole
                    if (!role) {
                        
                        return
                    }

                    const room = this.docIdToRoomMap.get(docId)

                    if (!room) {
                        
                        return
                    }

                    this.addToAccessCache(user, docId, role)
                    console.log(this.accessCache, "join");
                    

                    socketManager.addUser(user, docId)
                    socketManager.broadCast(docId, {
                        type : RoomOutputType.USER_JOINDED,
                        data : {
                            roomId : docId,
                            doc : room.doc,
                            version : room.rev
                        }
                    })
                }
                
                
                
            }

            if (message.type === RoomType.JOIN_ROOM) {

               
                const room = this.docIdToRoomMap.get(docId)
                if (!room) {
                    return
                }
                socketManager.addUser(user, room.roomId)
                socketManager.broadCast(room.roomId, {
                    type : RoomOutputType.USER_JOINDED,
                    data : {
                        roomId : room.roomId,
                        doc : room.doc,
                        version : room.rev
                    }
                })
            }

            if (message.type === OpType.INSERT) {
                const room = this.docIdToRoomMap.get(docId)
                                
                
                if (!room) {
                    console.error("No such room present!")
                    return
                }

                room.receiveOp(message.data.op)
                
            }

            if (message.type === OpType.DELETE) {
                const room = this.docIdToRoomMap.get(docId)
                
                if (!room) {
                    console.error("No such room present!")
                    return
                }

                
                room.receiveOp(message.data.op)
                
            }
        })
    }

    

}