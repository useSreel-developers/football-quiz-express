import { Socket } from "socket.io";

export type UserType = {
  userId: string;
  userName: string;
  userAvatar: string | null;
  socket: Socket | null;
  isBot: boolean;
};

class UsersData {
  private _users: UserType[];

  constructor() {
    this._users = [];
  }

  get users(): UserType[] {
    return this._users;
  }

  checkUser(userId: string): boolean {
    return Boolean(this._users.filter((user) => user.userId === userId).length);
  }

  addUser(user: UserType): void {
    this._users.push(user);
  }

  deleteUser(socketId: string) {
    this._users = this._users.filter((user) => {
      if (!user.isBot && user.socket) {
        return user.socket.id !== socketId;
      }

      return user;
    });
  }
}

export default UsersData;
