import { MESSAGE_INPUT_TYPE, RoomOutputType, RoomType } from "@repo/types/ws-types";
import { Room } from "./Room.js";
import { Op, OpType } from "@repo/types/ot-types";
import { socketManager, User } from "./SocketManager.js";
import { prisma } from "@repo/db";




export class RoomManager {
    
    private rooms: Room[]
    private users: User[]

    constructor() {
        this.rooms = []
        this.users = []
    }

    addUser(user: User) {
        this.users.push(user)
        this.addHandler(user)
    }

    removeUser(user: User) {  
        const u = this.users.find((u) => u.socket === user.socket)
        if (!u) {
            console.error("User not found");
            return;
        }

        
        this.removeHandler(u)

    }

    removeRoom(roomId: string) {
        this.rooms = this.rooms.filter((r) => r.roomId !== roomId)
    }

    getOrLoad(roomId : string) : Room {
        const room = this.rooms.find(r => r.roomId === roomId)
        if (!room) {
            const newInMemoryRoom = new Room()
            return newInMemoryRoom
        } else {
            return room
        }
    }

    

    private addHandler(user: User) {
        user.socket.on("message", async (data) => {
            const message = JSON.parse(data.toString()) as MESSAGE_INPUT_TYPE

            if (message.type == RoomType.INIT_ROOM) {
                
                
                const room = new Room()
                
                const newDoc = await prisma.document.create({
                    data : {
                        id : room.roomId,
                        title : "untitled",
                        version : room.rev,
                        members : {
                            create : [
                                {
                                    userId : user.id,
                                    role : "OWNER"
                                }
                            ]
                        }
                    }
                })
                
                

                this.rooms.push(room)
                socketManager.addUser(user, room.roomId)
                socketManager.broadCast(room.roomId, {
                    type : RoomOutputType.ROOM_CREATED,
                    data : {
                        roomId : room.roomId,
                        doc : room.doc,
                        version : room.rev
                    }
                })
                
            }

            if (message.type === RoomType.JOIN_ROOM) {

                // const roomInDb = await prisma.document.findUnique({
                //     where : {
                //         id : message.data.roomId
                //     }
                // })
                // if (!roomInDb) {
                //     console.error("No such room created!")
                //     return
                // }

                // if the room is present in the server check here
                // const room = this.getOrLoad(roomInDb.id)

                const room = this.rooms.find(r => r.roomId === message.data.roomId)
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
                const room = this.rooms.find(r => r.roomId === message.data.roomId)
                                
                
                if (!room) {
                    console.error("No such room present!")
                    return
                }

                room.receiveOp(message.data.op)
                
            }

            if (message.type === OpType.DELETE) {
                const room = this.rooms.find(r => r.roomId === message.data.roomId)
                
                if (!room) {
                    console.error("No such room present!")
                    return
                }

                
                room.receiveOp(message.data.op)
                
            }
        })
    }

    private removeHandler(user: User) {
        user.socket.on("message", async (data) => {
            const message = JSON.parse(data.toString()) as MESSAGE_INPUT_TYPE
            if (message.type == RoomType.DELETE_ROOM) {
                const room = this.rooms.find(r => r.roomId === message.data.roomId)
                if (!room) {
                    console.error("THere is no such room")
                    return
                }

                socketManager.removeUser(user, room.roomId)
                this.users = this.users.filter((u) => u.socket !== user.socket)
            }
        })
    }

}