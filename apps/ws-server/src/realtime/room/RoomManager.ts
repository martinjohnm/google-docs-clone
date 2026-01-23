import { MESSAGE_INPUT_TYPE, RoomOutputType, RoomType } from "@repo/types/ws-types";
import { Room } from "./Room.js";
import { OpType } from "@repo/types/ot-types";
import { socketManager } from "../socket/SocketManager.js";
import { Role } from "@repo/db";
import { User } from "../../auth/User.js";
import { DocId, RoomId, UserId } from "./RoomTypes.js";
import { loadRoomAndPermissionsFromDb } from "./RoomFactory.js";




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


    private addHandler(user: User) {
        user.socket.on("message", async (data) => {
            const message = JSON.parse(data.toString()) as MESSAGE_INPUT_TYPE

            const docId = message.data.docId

            if (message.type == RoomType.INIT_ROOM) {
                
                if (!this.docIdToRoomMap.has(docId)) {
                    
                    const room = await loadRoomAndPermissionsFromDb(user.userIdFromDb, docId)

                    if (!room) {
                        
                        return
                    }

                    this.docIdToRoomMap.set(docId, room)
                    
                    socketManager.addUser(user, room.roomId)
                    socketManager.broadCast(room.roomId, {
                        type : RoomOutputType.ROOM_CREATED,
                        data : {
                            roomId : room.roomId,
                            doc : room.doc,
                            version : room.rev
                        }
                    })
                } else {

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