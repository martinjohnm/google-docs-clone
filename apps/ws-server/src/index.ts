

import "dotenv/config"

import { WebSocketServer } from "ws";
import { RoomManager } from "./websocket/RoomManager.js";
import { User } from "./websocket/SocketManager.js";
import { startWriter } from "./persistance/writer.js";


startWriter()

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