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
  red: boolean | null;
  green: boolean | null;
  blue: boolean | null;
  yellow: boolean | null;
  black: boolean | null;
};

type Answers = {
  question1: AnswerItem;
  question2: AnswerItem;
  question3: AnswerItem;
  question4: AnswerItem;
  question5: AnswerItem;
  question6: AnswerItem;
  question7: AnswerItem;
  question8: AnswerItem;
  question9: AnswerItem;
  question10: AnswerItem;
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
      try {
        if (rooms.filter((room) => room.roomId === data.roomId).length) {
          rooms = rooms.map((room) => {
            // cek room yang dimaksudkan
            if (room.roomId === data.roomId) {
              // cek sesi pertanyaan ke berapa
              if (data.question.no === 1) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question1.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question1.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question1.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question1.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question1.black = data.question.status;
                }
              } else if (data.question.no === 2) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question2.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question2.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question2.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question2.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question2.black = data.question.status;
                }
              } else if (data.question.no === 3) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question3.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question3.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question3.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question3.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question3.black = data.question.status;
                }
              } else if (data.question.no === 4) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question4.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question4.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question4.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question4.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question4.black = data.question.status;
                }
              } else if (data.question.no === 5) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question5.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question5.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question5.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question5.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question5.black = data.question.status;
                }
              } else if (data.question.no === 6) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question6.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question6.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question6.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question6.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question6.black = data.question.status;
                }
              } else if (data.question.no === 7) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question7.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question7.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question7.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question7.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question7.black = data.question.status;
                }
              } else if (data.question.no === 8) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question8.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question8.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question8.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question8.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question8.black = data.question.status;
                }
              } else if (data.question.no === 9) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question9.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question9.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question9.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question9.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question9.black = data.question.status;
                }
              } else if (data.question.no === 10) {
                // cek role penjawab apa
                if (data.role === "red") {
                  room.answers.question10.red = data.question.status;
                } else if (data.role === "green") {
                  room.answers.question10.green = data.question.status;
                } else if (data.role === "blue") {
                  room.answers.question10.blue = data.question.status;
                } else if (data.role === "yellow") {
                  room.answers.question10.yellow = data.question.status;
                } else if (data.role === "black") {
                  room.answers.question10.black = data.question.status;
                }
              }

              return room;
            }
            return room;
          });

          io.to(data.roomId).emit("playerAnswered", {
            answer: rooms.filter((room) => room.roomId === data.roomId)[0],
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
}
