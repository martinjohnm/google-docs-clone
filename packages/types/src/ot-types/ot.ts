

type OpBase = { clientId: string, rev: number, id: string }
export type InsertOp = OpBase & { type: "insert", pos: number, text: string }
export type DeleteOp = OpBase & { type: "delete", pos: number, length: number }
export type Op = InsertOp | DeleteOp

export type OtServerResponse = 
    {
        ack: boolean,
        applied: boolean,
        rev: number, 
        op : null
    } | {
        ack: boolean, 
        applied: boolean,
        rev : number,
        op : Op
    }
