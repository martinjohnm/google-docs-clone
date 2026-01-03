

import "dotenv/config"

import { prisma } from "@repo/db";
import { makeId } from "@repo/ot-core";

import { Room } from "./Room.js";
import { WebSocketServer } from "ws";
import { RoomManager } from "./RoomManager.js";
import { User } from "./SocketManager.js";



const port = Number(process.env.PORT) || 8080
const wss = new WebSocketServer({port})

const roomManager = new RoomManager()

wss.on("connection", function connection(ws, req) {
  const user = new User(ws)
  roomManager.addUser(user)

  ws.on("close", () => {
    roomManager.removeUser(user)
  })
})