import { MESSAGE_OUTPUT_TYPE } from "@repo/types/ws-types";
import { User } from "../../auth/User";


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

    addUser(user: User, roomId: string) {
        this.roomUserMapping.set(roomId, [
            ...(this.roomUserMapping.get(roomId) || []),
            user
        ]);

        this.userRoomMapping.set(user.id, [
            ...(this.userRoomMapping.get(user.id) || []),
            roomId
        ])
    }

    broadCast(roomId: string, message: MESSAGE_OUTPUT_TYPE) {
        const users = this.roomUserMapping.get(roomId)
        if (!users) {
            console.error("No users in room")
            return;
        }

        users.forEach((user) => {
            user.socket.send(JSON.stringify(message))
        })
    }

    removeUser(user: User, roomId : string) {
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
    }
}

export const socketManager = SocketManager.getInstance()