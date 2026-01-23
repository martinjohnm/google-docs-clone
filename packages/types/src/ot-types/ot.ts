

export enum OpType {
    INSERT = "insert",
    DELETE = "delete",
    NO_OP  = "no_op"
}

type OpBase = { clientId: string, rev: number, id: string }
export type InsertOp = OpBase & { type: OpType.INSERT, pos: number, text: string }
export type DeleteOp = OpBase & { type: OpType.DELETE, pos: number, length: number }
export type Op = InsertOp | DeleteOp

export type OtServerDataResponse = 
    {
        ack: boolean,
        applied: boolean,
        rev: number, 
        op : null, 
        doc : string
    } | {
        ack: boolean, 
        applied: boolean,
        rev : number,
        op : Op,
        doc: string
    }



export interface OpsArrType {
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

export interface SnapshotType  {
    id: string;
    version: number;
    createdAt: Date;
    content: string;
    documentId: string;
}