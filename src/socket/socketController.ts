import { Server as SocketServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const colors = ["red", "green", "blue", "yellow", "black"];

// WAITING PLAYERS
type PlayerType = {
  socketId: string;
  socket: Socket;
  playerId: string;
};

const waitingPlayers: PlayerType[] = [];
// WAITING PLAYERS

// ANSWERS
type AnswerItem = {
  [key: string]: boolean | null;
};

type Answers = {
  [key: string]: AnswerItem;
};

type RoomAnswerItem = {
  roomId: string;
  answers: Answers;
};

let rooms: RoomAnswerItem[] = [];
// ANSWERS

export default function socketController(
  io: SocketServer,
  socket: Socket
): void {
  socket.on("matchmaking", (data: { playerId: string }) => {
    try {
      if (
        !waitingPlayers.filter((user) => user.socketId === socket.id).length
      ) {
        waitingPlayers.push({
          socketId: socket.id,
          socket,
          playerId: data.playerId,
        });

        if (waitingPlayers.length >= 5) {
          const roomId = `room_${uuidv4()}`;
          const fivePlayerSelectedToMatch = waitingPlayers.splice(0, 5);
          const question: AnswerItem = {
            red: null,
            green: null,
            blue: null,
            yellow: null,
            black: null,
          };

          rooms.push({
            roomId,
            answers: {
              question1: question,
              question2: question,
              question3: question,
              question4: question,
              question5: question,
              question6: question,
              question7: question,
              question8: question,
              question9: question,
              question10: question,
            },
          });

          for (let i = 0; i < fivePlayerSelectedToMatch.length; i++) {
            fivePlayerSelectedToMatch[i].socket.join(roomId);
            fivePlayerSelectedToMatch[i].socket.emit("matchFound", {
              roomId,
              players: fivePlayerSelectedToMatch.map((player, index) => ({
                role: colors[index],
                playerId: player.playerId,
              })),
              answers: {
                question1: { ...question },
                question2: { ...question },
                question3: { ...question },
                question4: { ...question },
                question5: { ...question },
                question6: { ...question },
                question7: { ...question },
                question8: { ...question },
                question9: { ...question },
                question10: { ...question },
              },
            });
          }
        } else {
          socket.emit("findingMatch", {
            message: "Finding Match, Please Wait",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(
    "answerQuestion",
    (data: {
      roomId: string;
      role: string;
      question: {
        no: number;
        status: boolean;
      };
    }) => {
      if (rooms.filter((room) => room.roomId === data.roomId).length) {
        rooms = rooms.map((room) => {
          // cek room yang dimaksudkan
          if (room.roomId === data.roomId) {
            room.answers[data.question.no][data.role] = data.question.status;
            return room;
          }
          return room;
        });

        io.to(data.roomId).emit("playerAnswered", {
          answer: rooms.filter((room) => room.roomId === data.roomId)[0],
        });
      }
    }
  );
}
