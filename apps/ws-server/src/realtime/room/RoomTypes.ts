

export type RoomId = string
export type DocContent = string
export type DocVersion = number
export type DocId = string
export type UserId = string


// Room manager function reaturn types
export type JoinRoomResult = {
    ok : false,
    reason: "ACCESS_DENIED"
} | {
    ok : true,
    roomId : string,
    doc : string,
    version : number 
}