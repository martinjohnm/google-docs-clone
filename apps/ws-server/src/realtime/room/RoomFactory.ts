import { Room } from "./Room";
import { DocId } from "./RoomTypes";




export async function loadRoomFromDb(docId : DocId) : Promise<Room> {


    

    return new Room("", docId)
}