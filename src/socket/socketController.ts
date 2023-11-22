import { Server as SocketServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import UsersData, { UserType } from "./data/UsersData";
import RoomsData from "./data/RoomsData";

const usersWaiting = new UsersData();
const rooms = new RoomsData();

interface RoomTimeout {
  [key: string]: NodeJS.Timeout | undefined;
}
const roomTimers: RoomTimeout = {};
const roomDeletors: RoomTimeout = {};

export default function socketController(
  io: SocketServer,
  socket: Socket
): void {
  // ### MATCHMAKING
  socket.on("matchmaking", ({ userId, userName, userAvatar }) => {
    if (!usersWaiting.checkUser(userId)) {
      usersWaiting.addUser({ userId, userName, userAvatar, socket });
      console.log(`Client with ID ${socket.id} waiting for match!`);

      userWaitingInfo();

      if (usersWaiting.users.length >= 3) {
        console.log("KKK");
      } else {
        usersWaiting.users.forEach((user: UserType) => {
          user.socket.emit("findingMatch", {
            message: "Finding Match, Please Wait",
            members: usersWaiting.users.map((user: UserType) => ({
              userId: user.userId,
              userName: user.userName,
              userAvatar: user.userAvatar,
            })),
          });
        });
      }
    }
  });
  // ### MATCHMAKING

  // ### DISCONNECT
  socket.on("disconnect", () => {
    usersWaiting.deleteUser(socket.id);
    console.log(`Client with ID ${socket.id} disconnected!`);

    userWaitingInfo();
  });
  // ### DISCONNECT
}

function userWaitingInfo() {
  console.log(
    "USER WAITING FOR MATCH: ",
    usersWaiting.users.map((user) => `${user.userId} - ${user.userName}`)
  );
}
