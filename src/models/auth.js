module.exports = {

  hasLogin() {
    return this.getToken();
  },

  getToken() {
    return this.getUser().Ticket;
  },

  login(user) {
    localStorage.user = JSON.stringify(user);
  },

  logout() {
    delete localStorage.user;
  },

  getUser() {
    return JSON.parse(localStorage.user || '{}');
  },

}