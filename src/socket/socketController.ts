import { Server as SocketServer, Socket } from "socket.io";
import UsersData from "./data/UsersData";
// import RoomsData from "./data/RoomsData";

const usersOnline = new UsersData();
const usersWaiting = new UsersData();
// const rooms = new RoomsData();

// interface RoomTimeout {
//   [key: string]: NodeJS.Timeout | undefined;
// }
// const roomTimers: RoomTimeout = {};
// const roomDeletors: RoomTimeout = {};

export default function socketController(
  io: SocketServer,
  socket: Socket
): void {
  // ### ADD USER TO ONLINE LIST
  let { userName, userId, userAvatar } = socket.handshake.query;
  userId = typeof userId === "string" ? userId : "";
  userName = typeof userName === "string" ? userName : "";
  userAvatar = typeof userAvatar === "string" ? userAvatar : "";

  if (!usersOnline.checkUser(userId)) {
    usersOnline.addUser({ userId, userName, userAvatar, socket });
    console.log(`Client with ID ${socket.id} connected!`);

    userOnlineInfo();
  }
  // ### ADD USER TO ONLINE LIST

  // ### DISCONNECT
  socket.on("disconnect", () => {
    usersOnline.deleteUser(socket.id);
    usersWaiting.deleteUser(socket.id);
    console.log(`Client with ID ${socket.id} disconnected!`);

    userWaitingInfo();
  });
  // ### DISCONNECT
}

function userOnlineInfo() {
  console.log(
    "USER ONLINE: ",
    usersOnline.users.map((user) => `${user.userId} - ${user.userName}`)
  );
}

function userWaitingInfo() {
  console.log(
    "USER WAITING FOR MATCH: ",
    usersWaiting.users.map((user) => `${user.userId} - ${user.userName}`)
  );
}
