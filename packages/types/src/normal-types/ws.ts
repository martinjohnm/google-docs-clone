import { Op, OpType, OtServerDataResponse } from "../ot-types/ot.js"




////   ======= ws input message types ===== ///////

export enum RoomType {
    INIT_ROOM = "init_room",
    DELETE_ROOM = "delete_room",
    JOIN_ROOM = "join_room"
}

type INIT_ROOM = {
    type : RoomType.INIT_ROOM
}
type JOIN_ROOM = {
    type : RoomType.JOIN_ROOM,
    data : {
        roomId : string,
        
    }
}
type DELETE_ROOM = {
    type : RoomType.DELETE_ROOM,
    data : {
        roomId : string,
        
    }
}
type DELETE_OP_FROM_CLIENT = {
    type : OpType.DELETE,
    data : {
        roomId : string,
        op : Op
    }
}
type INSERT_OP_FROM_CLIENT = {
    type : OpType.INSERT,
    data : {
        roomId : string,
        op: Op
    }
}

export type MESSAGE_INPUT_TYPE = INIT_ROOM | JOIN_ROOM | DELETE_ROOM | DELETE_OP_FROM_CLIENT | INSERT_OP_FROM_CLIENT



// ========= ws message output type ======== ////////////////////

export enum RoomOutputType {
    ROOM_CREATED = "room_created",
    USER_JOINDED = "user_joined"
} 

type ROOM_CREATED = {
    type : RoomOutputType.ROOM_CREATED,
    data : {
        roomId : string
    }
}

type USER_JOINED = {
    type : RoomOutputType.USER_JOINDED,
    data : {
        roomId : string
    }
}

type INSERT_OP_FROM_SERVER = {
    type : OpType.INSERT,
    data : OtServerDataResponse
}

type DELETE_OP_FROM_SERVER = {
    type : OpType.DELETE,
    data : OtServerDataResponse
}

type NO_OP_FROM_SERVER = {
    type : OpType.NO_OP,
    data : OtServerDataResponse
}


export type MESSAGE_OUTPUT_TYPE = ROOM_CREATED | USER_JOINED | INSERT_OP_FROM_SERVER | DELETE_OP_FROM_SERVER | NO_OP_FROM_SERVER