

import "dotenv/config"

import { prisma } from "@repo/db";
import { makeId } from "@repo/ot-core";

import { OtServerResponse } from "@repo/types/ot-types"
import { Room } from "./Room.js";

const l : OtServerResponse = {
  ack : true,
  applied : false,
  rev: 1,
  op : null
}

async function name() {
  const user = await prisma.user.findFirst() 
  
}

name()