import { Server as SocketServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import UsersData, { UserType } from "./data/UsersData";
import RoomsData from "./data/RoomsData";

const playerPerMatch = 3;
const usersWaiting = new UsersData();
const rooms = new RoomsData();

let roomBotFiller: NodeJS.Timeout | undefined = undefined;

export default function socketController(
  io: SocketServer,
  socket: Socket
): void {
  // ### MATCHMAKING
  socket.on("matchmaking", ({ userId, userName, userAvatar }) => {
    if (!usersWaiting.checkUser(userId)) {
      usersWaiting.addUser({
        userId,
        userName,
        userAvatar,
        socket,
        isBot: false,
      });
      console.log(`Client with ID ${socket.id} waiting for match!`);
      userWaitingInfo();

      usersWaiting.users.forEach((user: UserType) => {
        if (!user.isBot && user.socket) {
          user.socket.emit("findingMatch", {
            message: "Finding Match, Please Wait",
            members: usersWaiting.users.map((user: UserType) => ({
              userId: user.userId,
              userName: user.userName,
              userAvatar: user.userAvatar,
            })),
          });
        }
      });

      if (roomBotFiller === undefined) {
        let time = 60;
        roomBotFiller = setInterval(() => {
          usersWaiting.users.forEach((user: UserType) => {
            if (!user.isBot && user.socket) {
              user.socket.emit("findingMatchCountdown", {
                message: "Countdown Until Match Started",
                countdownTime: time,
              });
            }
          });

          if (time === 0) {
            if (roomBotFiller) clearInterval(roomBotFiller);
            roomBotFiller = undefined;

            fillWithBot();
            matchFound();
          }

          time--;
        }, 1000);
      }

      if (usersWaiting.users.length >= playerPerMatch) {
        if (roomBotFiller) clearInterval(roomBotFiller);
        roomBotFiller = undefined;

        matchFound();
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

// LOG USER WAITING FOR MATCH
function userWaitingInfo() {
  console.log(
    "USER WAITING FOR MATCH: ",
    usersWaiting.users.map((user) => `${user.userId} - ${user.userName}`)
  );
}
// LOG USER WAITING FOR MATCH

// FILL WAITING ROOM WITH BOT
function fillWithBot() {
  let loop = true;
  while (loop) {
    const botId = uuidv4();
    usersWaiting.addUser({
      userId: botId,
      userName: `bot_${botId.slice(0, 7)}`,
      userAvatar: null,
      socket: null,
      isBot: true,
    });

    usersWaiting.users.forEach((user: UserType) => {
      if (!user.isBot && user.socket) {
        user.socket.emit("findingMatch", {
          message: "Finding Match, Please Wait",
          members: usersWaiting.users.map((user: UserType) => ({
            userId: user.userId,
            userName: user.userName,
            userAvatar: user.userAvatar,
          })),
        });
      }
    });

    if (usersWaiting.users.length >= playerPerMatch) loop = false;
  }
}
// FILL WAITING ROOM WITH BOT

// ALL EVENT WHEN MATCH FOUND UNTIL GAME OVER
function matchFound() {
  const roomId = `room_${uuidv4()}`;
  const playerSelectedToMatch = usersWaiting.users.splice(0, playerPerMatch);
  rooms.addRoom({
    roomId,
    members: playerSelectedToMatch.map((player) => ({
      user: player,
      score: 0,
    })),
  });

  playerSelectedToMatch.forEach((user: UserType) => {
    if (!user.isBot && user.socket) {
      user.socket.join(roomId);
      user.socket.emit("matchFound", {
        message: "Match Found",
        roomId,
        questions: [
          {
            question: "Saya adalah?",
          },
          {
            question: "Kamu adalah?",
          },
          {
            question: "Dia adalah?",
          },
        ],
      });
    }
  });
}
// ALL EVENT WHEN MATCH FOUND UNTIL GAME OVER
