import { Server as SocketServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import sleep from "sleep-promise";
import _ from "lodash";
import UsersData, { UserType } from "./data/UsersData";
import RoomsData, { UserRoomtype } from "./data/RoomsData";
import { getRandomQuestions } from "../grpc/grpcClient";

const playerPerMatch = 3;
const questionPerMatch = 10;
const usersWaiting = new UsersData();
const rooms = new RoomsData();

let roomBotFiller: NodeJS.Timeout | undefined = undefined;
interface RoomTimeout {
  [key: string]: NodeJS.Timeout | undefined;
}
interface RoomNumberType {
  [key: string]: number;
}
const roomQuestionSession: RoomNumberType = {};
const roomTime: RoomNumberType = {};
const roomTimers: RoomTimeout = {};

export default function socketController(
  io: SocketServer,
  socket: Socket
): void {
  // ### MATCHMAKING
  socket.on("matchmaking", async ({ userId, userName, userAvatar }) => {
    if (!usersWaiting.checkUser(userId)) {
      usersWaiting.addUser({
        userId,
        userName,
        userAvatar,
        socketId: socket.id,
        isBot: false,
      });
      console.log(`Client with ID ${socket.id} waiting for match!`);

      userWaitingInfo();
      updateInfoUserWaitingList(io);

      if (roomBotFiller === undefined) {
        let time = 60;
        roomBotFiller = setInterval(async () => {
          usersWaiting.users.forEach((user: UserType) => {
            if (!user.isBot) {
              io.to(user.socketId).emit("findingMatchCountdown", {
                message: "Countdown Until Match Started",
                countdownTime: time,
              });
            }
          });

          if (time <= 0) {
            if (roomBotFiller) clearInterval(roomBotFiller);
            roomBotFiller = undefined;

            fillWithBot(io);
            const playerSelectedToMatch = usersWaiting.users.splice(
              0,
              playerPerMatch
            );
            await sleep(5000);
            matchFound(io, playerSelectedToMatch);
          }

          time--;
        }, 1000);
      }

      if (usersWaiting.users.length >= playerPerMatch) {
        if (roomBotFiller) clearInterval(roomBotFiller);
        roomBotFiller = undefined;

        const playerSelectedToMatch = usersWaiting.users.splice(
          0,
          playerPerMatch
        );
        await sleep(5000);
        matchFound(io, playerSelectedToMatch);
      }
    }
  });
  // ### MATCHMAKING

  // ### CANCEL MATCHMAKING
  socket.on("cancelMatchmaking", () => {
    usersWaiting.deleteUser(socket.id);
    console.log(`Client with ID ${socket.id} disconnected!`);

    if (usersWaiting.users.length === 0) {
      if (roomBotFiller) clearInterval(roomBotFiller);
      roomBotFiller = undefined;
    }

    userWaitingInfo();
    updateInfoUserWaitingList(io);
  });
  // ### CANCEL MATCHMAKING

  // STORE SCORE AND ANSWER
  socket.on("storeScore", ({ userId, userAvatar, roomId, answer, score }) => {
    if (rooms.checkRoom(roomId)) {
      console.log("ADA");
    }
  });
  // STORE SCORE AND ANSWER

  // ### DISCONNECT
  socket.on("disconnect", () => {
    usersWaiting.deleteUser(socket.id);
    console.log(`Client with ID ${socket.id} disconnected!`);

    if (usersWaiting.users.length === 0) {
      if (roomBotFiller) clearInterval(roomBotFiller);
      roomBotFiller = undefined;
    }

    userWaitingInfo();
    updateInfoUserWaitingList(io);
  });
  // ### DISCONNECT
}

// UPDATE USER WAITING LIST
function updateInfoUserWaitingList(io: SocketServer) {
  usersWaiting.users.forEach((user: UserType) => {
    if (!user.isBot) {
      io.to(user.socketId).emit("findingMatch", {
        message: "Finding Match, Please Wait",
        members: usersWaiting.users.map((user: UserType) => ({
          userId: user.userId,
          userName: user.userName,
          userAvatar: user.userAvatar,
        })),
      });
    }
  });
}
// UPDATE USER WAITING LIST

// LOG USER WAITING FOR MATCH
function userWaitingInfo() {
  console.log(
    "USER WAITING FOR MATCH: ",
    usersWaiting.users.map((user) => `${user.userId} - ${user.userName}`)
  );
}
// LOG USER WAITING FOR MATCH

// FILL WAITING ROOM WITH BOT
function fillWithBot(io: SocketServer) {
  let loop = true;
  while (loop) {
    const botId = uuidv4();
    usersWaiting.addUser({
      userId: botId,
      userName: `bot_${botId.slice(0, 7)}`,
      userAvatar: null,
      socketId: "",
      isBot: true,
    });

    userWaitingInfo();
    updateInfoUserWaitingList(io);

    if (usersWaiting.users.length >= playerPerMatch) loop = false;
  }
}
// FILL WAITING ROOM WITH BOT

// ALL EVENT WHEN MATCH FOUND UNTIL GAME OVER
async function matchFound(io: SocketServer, playerSelectedToMatch: UserType[]) {
  const roomId = `room_${uuidv4()}`;

  rooms.addRoom({
    roomId,
    members: playerSelectedToMatch.map((player) => ({
      user: player,
      score: 0,
    })),
    temporaryAnswer: [],
  });

  const questions = await getRandomQuestions();

  playerSelectedToMatch.forEach((user: UserType) => {
    if (!user.isBot) {
      const socket = io.sockets.sockets.get(user.socketId);
      if (socket) {
        socket.join(roomId);
        io.to(user.socketId).emit("matchFound", {
          message: "Match Found",
          roomId,
          questions,
        });
      } else {
        console.log("ERROR 52637264");
      }
    }
  });

  roomTime[roomId] = 10;
  roomQuestionSession[roomId] = 0;
  roomTimers[roomId] = setInterval(roomTimersController, 1000);

  function roomTimersController() {
    if (roomQuestionSession[roomId] >= questionPerMatch) {
      console.log("MATCH OVER");

      if (roomTimers[roomId]) clearInterval(roomTimers[roomId]);
    } else {
      io.to(roomId).emit("matchStarted", {
        message: "Match Started",
        timeRemaining: roomTime[roomId],
      });

      if (roomTime[roomId] === 0) {
        roomTime[roomId] = 10;
        roomQuestionSession[roomId]++;

        if (roomTimers[roomId]) clearInterval(roomTimers[roomId]);

        rooms.getRoom(roomId).members.forEach((player: UserRoomtype) => {
          if (player.user.isBot) {
            rooms.addTemporaryAnswer(
              roomId,
              null,
              ["A", "B", "C", "D"][_.random(0, 3)]
            );
          }
        });

        setTimeout(() => {
          roomTimers[roomId] = setInterval(roomTimersController, 1000);
        }, 5000);
      } else {
        roomTime[roomId]--;
      }
    }
  }
}
// ALL EVENT WHEN MATCH FOUND UNTIL GAME OVER
