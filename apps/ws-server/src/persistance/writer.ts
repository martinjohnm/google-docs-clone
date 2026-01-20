import { prisma } from "@repo/db";
import { persistanceQueue } from "./queue.js";





export async function startWriter() {
    while (true) {
        if (persistanceQueue.length === 0) {
            await new Promise(r => setTimeout(r, 5))
            continue
        }

        const op = persistanceQueue.shift()
        if (!op) continue

        console.log(op);
        
    }
}