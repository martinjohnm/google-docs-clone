import { MESSAGE_INPUT_TYPE, RoomOutputType, RoomType } from "@repo/types/ws-types";
import { Room } from "./Room.js";
import { OpType } from "@repo/types/ot-types";
import { socketManager } from "../socket/SocketManager.js";
import { Role } from "@repo/db";
import { User } from "../../auth/User.js";
import { DocId, RoomId, UserId } from "./RoomTypes.js";
import { loadRoomFromDb } from "./RoomFactory.js";




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
        // const u = this.users.find((u) => u.socket === user.socket)
        // if (!u) {
        //     console.error("User not found");
        //     return;
        // }

        
        // this.removeHandler(u)

    }

    removeRoom(docId: DocId) {
        if (this.docIdToRoomMap.has(docId)) {
            this.docIdToRoomMap.delete(docId)
        }
    }


    private addHandler(user: User) {
        user.socket.on("message", async (data) => {
            const message = JSON.parse(data.toString()) as MESSAGE_INPUT_TYPE

            if (message.type == RoomType.INIT_ROOM) {
                
                if (!this.docIdToRoomMap.has(message.data.docId)) {
                    
                    const room = await loadRoomFromDb(message.data.docId)

                    this.docIdToRoomMap.set(message.data.docId, room)
                    
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

               
                const room = this.docIdToRoomMap.get(message.data.docId)
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
                const room = this.docIdToRoomMap.get(message.data.docId)
                                
                
                if (!room) {
                    console.error("No such room present!")
                    return
                }

                room.receiveOp(message.data.op)
                
            }

            if (message.type === OpType.DELETE) {
                const room = this.docIdToRoomMap.get(message.data.docId)
                
                if (!room) {
                    console.error("No such room present!")
                    return
                }

                
                room.receiveOp(message.data.op)
                
            }
        })
    }

    

}