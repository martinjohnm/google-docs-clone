import { MESSAGE_INPUT_TYPE, RoomOutputType, RoomType } from "@repo/types/ws-types";
import { Room } from "./Room.js";
import { socketManager, User } from "./SocketManager.js";
import { Op, OpType } from "@repo/types/ot-types";




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

    

    private addHandler(user: User) {
        user.socket.on("message", async (data) => {
            const message = JSON.parse(data.toString()) as MESSAGE_INPUT_TYPE

            if (message.type == RoomType.INIT_ROOM) {
                
            
                const room = new Room()
                this.rooms.push(room)
                socketManager.addUser(user, room.roomId)
                socketManager.broadCast(room.roomId, {
                    type : RoomOutputType.ROOM_CREATED,
                    data : {
                        roomId : room.roomId
                    }
                })
                
            }

            if (message.type === RoomType.JOIN_ROOM) {
                const room = this.rooms.find(r => r.roomId === message.data.roomId)

                if (!room) {
                    console.error("No such room present!")
                    return
                }

                socketManager.addUser(user, room.roomId)
                socketManager.broadCast(room.roomId, {
                    type : RoomOutputType.USER_JOINDED,
                    data : {
                        roomId : room.roomId
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