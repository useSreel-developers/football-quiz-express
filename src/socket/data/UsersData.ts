export type UserType = {
  userId: string;
  userName: string;
  userAvatar: string | null;
  socketId: string;
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
    this._users = this._users.filter((user) => user.socketId !== socketId);
  }
}

export default UsersData;
