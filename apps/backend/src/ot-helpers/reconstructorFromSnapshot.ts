import { applyOp } from "@repo/ot-core";
import { Op, OpType } from "@repo/types/ot-types";

interface OpsArrType {
    length: number | null;
    id: string;
    version: number;
    createdAt: Date;
    userId: string;
    documentId: string;
    type: any;
    position: number;
    text: string | null;
}

interface SnapshotType  {
    id: string;
    version: number;
    createdAt: Date;
    content: string;
    documentId: string;
}

export const reconstructorFromSnapshot = (latestSnapshotFromDb : SnapshotType, opsArrAfterLatestSnapFromDb : OpsArrType[]) : {doc: string, version: number} => {


    if (opsArrAfterLatestSnapFromDb.length === 0) {
        return {
        doc : latestSnapshotFromDb.content,
        version : latestSnapshotFromDb.version
    } }

    let doc : string = latestSnapshotFromDb.content
    
    for (let i =0;i < opsArrAfterLatestSnapFromDb.length; i++) {

        const opFromDb = opsArrAfterLatestSnapFromDb[i]

        if (!opFromDb) continue

        const opType = opFromDb.type

        let op : Op | null = null

        if (opType === OpType.INSERT) {
            op  = {
                type : OpType.INSERT,
                pos : opFromDb.position,
                text : opFromDb.text ?? "",
                id : opFromDb.id,
                rev : opFromDb.version,
                clientId : ""

            }
        } else {
            op = {
                type : OpType.DELETE,
                pos : opFromDb.position,
                length : opFromDb.length ?? 1,
                id : opFromDb.id,
                rev : opFromDb.version,
                clientId : ""

            }
        }

        if (!op) continue

        doc = applyOp(doc, op)
    }

    return {
        doc,
        version : 0
    }
}