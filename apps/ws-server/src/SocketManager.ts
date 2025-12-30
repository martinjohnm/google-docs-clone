import { randomUUID } from "crypto";
import { WebSocket } from "ws";


export class User {
    public socket : WebSocket
    public id : string

    constructor(socket : WebSocket) {
        this.socket = socket
        this.id = randomUUID();
    }
}

class SocketManager {
    private static instance : SocketManager
    private interestedSockets : Map<string, User[]>
    private userRoomMapping : Map<string, string>

    private constructor() {
        this.interestedSockets = new Map<string, User[]>()
        this.userRoomMapping = new Map<string, string>
    }

    static getInstance() {
        if (SocketManager.instance) {
            return SocketManager.instance
        }

        SocketManager.instance = new SocketManager();
        return SocketManager.instance
    }

    
}