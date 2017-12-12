import cookie from 'react-cookie'
const tokenName = 'token'
module.exports = {

  hasLogin() {
    return this.getUser() && this.getToken();
  },

  getToken() {
    return cookie.load(tokenName);
  },

  login(user) {
    localStorage.user = JSON.stringify(user);
    cookie.save(tokenName, user.Token);
  },

  logout() {
    delete localStorage.user;
    cookie.remove(tokenName);
  },

  getUser() {
    return JSON.parse(localStorage.user || '{}');
  },

  isCurrentUser(id) {
    let user = this.getUser();
    return user.ID === id;
  },

  hasRight(rightName) {
    if (!rightName) return true;
    let user = this.getUser();
    return !!user.UserGroups.find(e => e.Group.Rights.find(r => r.Name === rightName));
  }

}