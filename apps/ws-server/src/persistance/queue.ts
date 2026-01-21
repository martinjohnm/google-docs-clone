import { Op } from "@repo/types/ot-types";


interface QueueData {
    op : Op,
    version : number
}


export const persistanceQueue : QueueData[] = []