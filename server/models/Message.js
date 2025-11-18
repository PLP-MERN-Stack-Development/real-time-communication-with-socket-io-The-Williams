export default class Message {
  constructor(sender, senderId, text, isPrivate = false) {
    this.id = Date.now();
    this.sender = sender;
    this.senderId = senderId;
    this.text = text;
    this.isPrivate = isPrivate;
    this.timestamp = new Date().toISOString();
  }
}
