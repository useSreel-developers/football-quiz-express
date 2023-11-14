import { Server as SocketServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

type PlayerType = {
  socketId: string;
  socket: Socket;
  playerId: string;
};

const waitingPlayers: PlayerType[] = [];

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
          for (let i = 0; i < fivePlayerSelectedToMatch.length; i++) {
            fivePlayerSelectedToMatch[i].socket.join(roomId);
            fivePlayerSelectedToMatch[i].socket.emit("matchFound", {
              roomId,
              players: fivePlayerSelectedToMatch.map((player) => ({
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

  
}
