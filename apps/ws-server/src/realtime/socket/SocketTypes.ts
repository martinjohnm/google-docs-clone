import { OpType } from "@repo/db"




export type UserId = string
export type RoomId = string
export interface OpTypeToPersistInDB {
    documentId : string
    userId    : string
    version    :number
    type      : OpType
    position   :number
    text       :string | null
    length     :number | null
}