export default class User {
  constructor(id, username, room) {
    this.id = id;
    this.username = username;
    this.room = room;
    this.online = true;
  }
}
