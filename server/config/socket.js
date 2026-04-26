
import { Server } from "socket.io";
import { tripTracker, checkIsDelayStatus } from "../socket/trip_tracker.socket.js";
import cron from 'node-cron'


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

let isRunning = false;

// cron.schedule('*/5 * * * * *', async () => {
//   if (isRunning) {
//     console.log("Skipping cron - still running");
//     return;
//   }

//   isRunning = true;

//   try {
//     await checkIsDelayStatus(io);
//   } catch (err) {
//     console.error("Cron error:", err);
//   } finally {
//     isRunning = false;
//   }
// });

const getIO = () => io;

export{ initSocket, getIO };