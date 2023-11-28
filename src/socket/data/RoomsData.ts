import { UserType } from "./UsersData";

export type UserRoomtype = {
  user: UserType;
  score: number;
};

type TemporaryAnswer = {
  avatar: string | null;
  option: string;
};

export type RoomType = {
  roomId: string;
  temporaryAnswer: TemporaryAnswer[];
  members: UserRoomtype[];
};

class RoomsData {
  private _rooms: RoomType[];

  constructor() {
    this._rooms = [];
  }

  get rooms(): RoomType[] {
    return this._rooms;
  }

  getRoom(roomId: string): RoomType {
    return this._rooms.filter((room) => {
      return room.roomId === roomId;
    })[0];
  }

  checkRoom(roomId: string): boolean {
    return Boolean(this._rooms.filter((room) => room.roomId === roomId).length);
  }

  addRoom(room: RoomType): void {
    this._rooms.push(room);
  }

  deleteRoom(roomId: string) {
    this._rooms = this._rooms.filter((room) => room.roomId !== roomId);
  }

  addTemporaryAnswer(roomId: string, userAvatar: string | null, answer: string) {
    this._rooms = this._rooms.map((room) => {
      if (room.roomId === roomId) {
        return {
          ...room,
          temporaryAnswer: [
            ...room.temporaryAnswer,
            {
              avatar: userAvatar,
              option: answer,
            },
          ],
        };
      }

      return room;
    });
  }

  changeScore(userId: string, roomId: string, score: number) {
    this._rooms = this._rooms.map((room) => {
      if (room.roomId === roomId) {
        return {
          ...room,
          members: room.members.map((user) => {
            if (user.user.userId === userId) {
              return {
                ...user,
                score: user.score + score,
              };
            }

            return user;
          }),
        };
      }

      return room;
    });
  }
}

export default RoomsData;
