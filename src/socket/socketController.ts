import { Server as SocketServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const colors = ["red", "green", "blue", "yellow", "black"];

// WAITING PLAYERS
type PlayerType = {
  socketId: string;
  socket: Socket;
  playerId: string;
};

let waitingPlayers: PlayerType[] = [];
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

          for (let i = 0; i < fivePlayerSelectedToMatch.length; i++) {
            fivePlayerSelectedToMatch[i].socket.join(roomId);
            fivePlayerSelectedToMatch[i].socket.emit("matchFound", {
              message: "Match Found",
              socketId: fivePlayerSelectedToMatch[i].socket.id,
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
            socketId: socket.id,
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
      questionSection: number;
      statusAnswer: boolean;
    }) => {
      try {
        if (rooms.filter((room) => room.roomId === data.roomId).length) {
          rooms = rooms.map((room) => {
            // cek room yang dimaksudkan
            if (room.roomId === data.roomId) {
              room.answers[data.questionSection][data.role] = data.statusAnswer;
              return room;
            }
            return room;
          });

          io.to(data.roomId).emit("playerAnswered", {
            message: `A Player Answers`,
            answers: {
              ...rooms.filter((room) => room.roomId === data.roomId)[0],
            },
          });

          if (
            !checkStillNull(
              rooms.filter((room) => room.roomId === data.roomId)[0].answers
            )
          ) {
            const roleScore = {
              red: {
                correct: 0,
                wrong: 0,
              },
              green: {
                correct: 0,
                wrong: 0,
              },
              blue: {
                correct: 0,
                wrong: 0,
              },
              yellow: {
                correct: 0,
                wrong: 0,
              },
              black: {
                correct: 0,
                wrong: 0,
              },
            };

            const indexToDelete = rooms.findIndex(
              (item) => item.roomId === data.roomId
            );
            const roomMatchSelected = rooms.splice(indexToDelete, 1)[0].answers;
            for (const propAnswer in roomMatchSelected) {
              if (roomMatchSelected[propAnswer].red) {
                roleScore.red.correct += 1;
              } else {
                roleScore.red.wrong += 1;
              }

              if (roomMatchSelected[propAnswer].green) {
                roleScore.green.correct += 1;
              } else {
                roleScore.green.wrong += 1;
              }

              if (roomMatchSelected[propAnswer].blue) {
                roleScore.blue.correct += 1;
              } else {
                roleScore.blue.wrong += 1;
              }

              if (roomMatchSelected[propAnswer].yellow) {
                roleScore.yellow.correct += 1;
              } else {
                roleScore.yellow.wrong += 1;
              }

              if (roomMatchSelected[propAnswer].black) {
                roleScore.black.correct += 1;
              } else {
                roleScore.black.wrong += 1;
              }
            }

            io.to(data.roomId).emit("gameOver", {
              message: "Game Over",
              score: roleScore,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on("disconnect", () => {
    waitingPlayers = waitingPlayers.filter(
      (player) => player.socketId !== socket.id
    );

    console.log(`Client with id ${socket.id} disconnected!`);
  });
}

function checkStillNull(answer: Answers) {
  for (const prop of Object.values(answer)) {
    if (Object.values(prop).some((value) => value === null)) {
      return true;
    }
  }
  return false;
}
