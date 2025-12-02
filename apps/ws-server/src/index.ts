

import "dotenv/config"

import { prisma } from "@repo/db";


async function name() {
  const user = await prisma.user.findFirst() 
  console.log(user);
  
}

name()