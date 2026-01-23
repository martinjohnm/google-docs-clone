

import "dotenv/config"

import { WebSocketServer } from "ws";
import { RoomManager } from "./realtime/room/RoomManager.js";
import { startWriter } from "./persistance/writer.js";
import url from "url"
import { User } from "./auth/User.js";
import { socketManager } from "./realtime/socket/SocketManager.js";

startWriter()

const port = Number(process.env.PORT) || 8080
const wss = new WebSocketServer({port})


wss.on("connection", function connection(ws, req) {
  //@ts-ignore
  const token: string = url.parse(req.url, true).query.token
  
  
  const user = new User(token, ws)
  
  socketManager.onConnection(user)

  ws.on("close", () => {
    
    socketManager.onDisconnect(user)
  })
}) 