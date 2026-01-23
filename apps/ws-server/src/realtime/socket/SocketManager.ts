import { MESSAGE_INPUT_TYPE, MESSAGE_OUTPUT_TYPE, RoomOutputType, RoomType } from "@repo/types/ws-types";
import { User } from "../../auth/User";
import { OpType } from "@repo/types/ot-types";
import { roomManager } from "../room/RoomManager";


export type UserId = string
export type RoomId = string

class SocketManager {
    private static instance : SocketManager
    private roomUserMapping : Map<RoomId, User[]> // mapping socketId with corresponding user obj socketId => User
    private userRoomMapping : Map<UserId, RoomId[]> // mapping userId with corresponding socketId

    private constructor() {
        this.roomUserMapping = new Map<RoomId, User[]>()
        this.userRoomMapping = new Map<UserId, RoomId[]>()
    }

    static getInstance() {
        if (SocketManager.instance) {
            return SocketManager.instance
        }

        SocketManager.instance = new SocketManager();
        return SocketManager.instance
    }

    onConnection(user: User) {
        this.addHandler(user)
    }

    onDisconnect(user: User) {
        this.removeHandler(user)
    }

    private addUser(user: User, roomId: string) {
        this.roomUserMapping.set(roomId, [
            ...(this.roomUserMapping.get(roomId) || []),
            user
        ]);

        this.userRoomMapping.set(user.id, [
            ...(this.userRoomMapping.get(user.id) || []),
            roomId
        ])
    }

    private broadCast(roomId: string, message: MESSAGE_OUTPUT_TYPE) {
        const users = this.roomUserMapping.get(roomId)
        if (!users) {
            console.error("No users in room")
            return;
        }

        users.forEach((user) => {
            user.socket.send(JSON.stringify(message))
        })
    }

    private removeHandler(user : User) {
        const rooms = this.userRoomMapping.get(user.id)
        if (!rooms || rooms.length === 0) {
            console.error("User is not interested in any room")
            return;
        }

        rooms.forEach((roomId) => {
            this.removeUserFromRoom(user, roomId)
        })


        
        
    }

    private removeUserFromRoom(user: User, roomId : string) {
        const rooms = this.userRoomMapping.get(user.id)
        if (!rooms || rooms.length === 0) {
            console.error("User is not interested in any room")
            return;
        }
        const interestedUsers = this.roomUserMapping.get(roomId) || []
        const remainingUsers = interestedUsers.filter(u => 
            u.id !== user.id
        )

        this.roomUserMapping.set(
            roomId,
            remainingUsers
        )

        if (this.roomUserMapping.get(roomId)?.length === 0) {
            this.roomUserMapping.delete(roomId)
            
        }

        // this.userRoomMapping.delete(user.id)
        // delete the roomId from the userRoom maping if it have zero users 
        const remainingRooms = rooms.filter(roomIdExisting => 
            roomIdExisting !== roomId
        )
        this.userRoomMapping.set(
            user.id,
            remainingRooms
        )
        if (this.userRoomMapping.get(user.id)?.length === 0) {
            this.userRoomMapping.delete(user.id)
            
        }
    }


    private addHandler(user: User) {


        user.socket.on("message" , async (data) => {
            const message = JSON.parse(data.toString()) as MESSAGE_INPUT_TYPE

            if (message.type === RoomType.INIT_ROOM) {
                const room = await roomManager.createOrJoinRoom(user, message.data.docId)

                if (!room) return

                this.addUser(user, room.roomId)
                this.broadCast(room.roomId, {
                    type : RoomOutputType.USER_JOINDED,
                    data : {
                        roomId : room.roomId,
                        doc : room.doc,
                        version : room.rev
                    }
                })
            }

            if (message.type === RoomType.JOIN_ROOM) {

            }

            if (message.type === OpType.INSERT) {
                const messageFromRoom = roomManager.receiveOp(message.data.docId, message.data.op)
                if (!messageFromRoom) return
                this.broadCast(message.data.docId, messageFromRoom)
                // persist to db 
            }

            if (message.type === OpType.DELETE) {
                const messageFromRoom = roomManager.receiveOp(message.data.docId, message.data.op)
                if (!messageFromRoom) return
                this.broadCast(message.data.docId, messageFromRoom)
                // persist to db 
            }
            
            console.log(this.userRoomMapping, this.roomUserMapping);
            

        })

    }


}

export const socketManager = SocketManager.getInstance()