import { Op, OpType, OtServerDataResponse } from "../ot-types/ot.js"




////   ======= ws input message types ===== ///////

export enum RoomType {
    INIT_ROOM = "init_room",
    DELETE_ROOM = "delete_room",
    JOIN_ROOM = "join_room"
}

export enum UserType {
    DELETE_USER = "delete_user"
}

type INIT_ROOM = {
    type : RoomType.INIT_ROOM,
    data : {
        userId : string,
        docId : string
    }
}
type JOIN_ROOM = {
    type : RoomType.JOIN_ROOM,
    data : {
        docId : string
    }
}
type DELETE_ROOM = {
    type : RoomType.DELETE_ROOM,
    data : {
        roomId : string,
        
    }
}

type DELETE_USER_FROM_ROOM = {
    type : UserType.DELETE_USER,
    data : {
        roomId : string
    }
}

type DELETE_OP_FROM_CLIENT = {
    type : OpType.DELETE,
    data : {
        docId : string,
        op : Op
    }
}
type INSERT_OP_FROM_CLIENT = {
    type : OpType.INSERT,
    data : {
        docId : string,
        op: Op
    }
}

export type MESSAGE_INPUT_TYPE = INIT_ROOM | JOIN_ROOM | DELETE_ROOM | DELETE_OP_FROM_CLIENT | INSERT_OP_FROM_CLIENT | DELETE_USER_FROM_ROOM



// ========= ws message output type ======== ////////////////////

export enum RoomOutputType {
    ROOM_CREATED = "room_created",
    USER_JOINDED = "user_joined",
    NO_ROOM_FOUND = "no_room_found"
} 

export type ROOM_CREATED = {
    type : RoomOutputType.ROOM_CREATED,
    data : {
        roomId : string, 
        doc : string,
        version : number
    }
}

export type NO_ROOM_FOUND = {
    type : RoomOutputType.NO_ROOM_FOUND,
    
}

export type USER_JOINED = {
    type : RoomOutputType.USER_JOINDED,
    data : {
        roomId : string, 
        doc : string,
        version : number
    }
}

export type INSERT_OP_FROM_SERVER = {
    type : OpType.INSERT,
    data : OtServerDataResponse
}

export type DELETE_OP_FROM_SERVER = {
    type : OpType.DELETE,
    data : OtServerDataResponse
}

export type NO_OP_FROM_SERVER = {
    type : OpType.NO_OP,
    data : OtServerDataResponse
}


export type MESSAGE_OUTPUT_TYPE = ROOM_CREATED | NO_ROOM_FOUND | USER_JOINED | INSERT_OP_FROM_SERVER | DELETE_OP_FROM_SERVER | NO_OP_FROM_SERVER