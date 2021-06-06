export class User {
  constructor(nickname, operator) {
    this.nickname = nickname;
    this.operator = operator;
    this.avatarUrl = '';
  }

  setAvatar(url) {
    this.avatarUrl = url;
  }
};