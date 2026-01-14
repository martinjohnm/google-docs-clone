
import { DeleteOp, InsertOp, Op, OpType } from "@repo/types/ot-types"


export function makeId() : string {
    return Math.random().toString(36).slice(2,9)
}

export function tieBreak(aId: string, bId : string) {
    return aId < bId
}


// apply

export function applyOp(doc: string, op: Op) : string {
    if (op.type == OpType.INSERT) {
        return doc.slice(0, op.pos) + op.text + doc.slice(op.pos)
    } else {
        return doc.slice(0, op.pos) + doc.slice(op.pos, op.length)
    }
}

// Transforms

// Insert vs Insert

function transformInsertInsert(a: InsertOp, b: InsertOp, tieBreakClientId: (aId: string, bId: string) => boolean) : InsertOp {
    // first op inserted before the second
    if (a.pos < b.pos) return a;
    // second op inserted before the first transform the op
    if (a.pos > b.pos) return {
        ...a,
        pos: a.pos + b.text.length
    }

    // if inserted at the same position 
    if (tieBreakClientId(a.clientId, b.clientId)) return a; // a wins and stays
    return {
        ...a,
        pos : a.pos + b.text.length
    }

}

function transformInsertDelete(a: InsertOp, b: DeleteOp): InsertOp | null {
    const b_pos = b.pos, b_length = b.length

    if (a.pos <= b.pos) return a
    if (a.pos >= b_pos + b_length) return {
        ...a,
        pos: a.pos - b_length
    } 

    // no op
    return null
}

function transformDeleteInsert(a: DeleteOp, b: InsertOp): DeleteOp {
    const b_pos = b.pos, b_length = b.text.length

    if (b_pos <= a.pos) return {
        ...a,
        pos: a.pos + b_length
    }

    if (b_pos >= a.pos + a.length) return a

    const newLen = a.length + b_length
    return {
        ...a,
        length: newLen
    }



}

function transformDeleteDelete(a: DeleteOp, b: DeleteOp): DeleteOp | null {
    const aStart = a.pos, aEnd = a.pos + a.length
    const bStart = b.pos, bEnd = b.pos + b.length

    // b is completely before a 
    if (bEnd <= aStart) return {...a, pos: a.pos - b.length}

    // a is completely before b 
    if (bStart >= aEnd) return a;

    // overlapping
    const overlapStart = Math.max(aStart, bStart)
    const overlapEnd = Math.min(aEnd, bEnd)
    const overlapLen = Math.max(0, overlapEnd-overlapStart)

    
    let newPos = aStart
    let newLen = a.length - overlapLen

    if (bStart < aStart) {
        const shift = Math.min(b.length, aStart - bStart)
        newPos = aStart - shift
    }

    if (newLen <= 0) return null
    return {
        ...a,
        pos: newPos,
        length : newLen
    }

}

export function transform(a: Op, b: Op, tieBreakClientId: (aId: string, bId: string) => boolean) : Op | null {
    if (a.type === "insert" && b.type === "insert") return transformInsertInsert(a, b, tieBreakClientId);
    if (a.type === "insert" && b.type === "delete") return transformInsertDelete(a, b);
    if (a.type === "delete" && b.type === "insert") return transformDeleteInsert(a, b);
    if (a.type === "delete" && b.type === "delete") return transformDeleteDelete(a, b);
    return a;
}

export function transformPair(
  a: Op,
  b: Op,
  tieBreakClientId: (aId: string, bId: string) => boolean
): [Op | null, Op | null] {
  const aPrime = transform(a, b, tieBreakClientId);
  const bPrime = transform(b, a, tieBreakClientId);
  return [aPrime, bPrime];
}


export function transformAgainstSequence(a: Op, seq: Op[], tieBreakClientId: (aId: string, bId: string) => boolean) : Op | null {
    let out : Op | null = a;

    for (const b of seq) {
        if (out == null) return null;
        out = transform(out, b , tieBreakClientId)
    }
    return out
}

