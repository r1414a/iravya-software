
import { Server } from "socket.io";
import { tripTracker } from "../socket/trip_tracker.socket.js";

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
        origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        tripTracker(socket, io)
        socket.on("disconnect", (reason) => {
            console.log("Disconnected:", reason)
        })
    });
  
};

const getIO = () => io;

export{ initSocket, getIO };