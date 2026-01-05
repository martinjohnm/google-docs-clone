import { Op, OpType } from "@repo/types/ot-types";

export function getTextOperation(oldText: string, newText: string) : Op | null {
  let start = 0;

  while (
    start < oldText.length &&
    start < newText.length &&
    oldText[start] === newText[start]
  ) {
    start++;
  }

  let endOld = oldText.length - 1;
  let endNew = newText.length - 1;

  while (
    endOld >= start &&
    endNew >= start &&
    oldText[endOld] === newText[endNew]
  ) {
    endOld--;
    endNew--;
  }

  // INSERT
  if (newText.length > oldText.length) {
    return {
      clientId : "1",
      rev : 0,
      id : "1",
      type : OpType.INSERT,
      pos: start,
      text: newText.slice(start, endNew + 1),
    };
  }

  // DELETE
  if (newText.length < oldText.length) {
    return {
      clientId : "1",
      rev : 0,
      id : "1",
      type : OpType.DELETE,
      pos: start,
      length: endOld - start + 1,
    };
  }

  return null;
}
