import cookie from 'react-cookie'

module.exports = {

  hasLogin() {
    return this.getToken();
  },

  getToken() {
    //return cookie.select(/token/ig);
    return this.getUser().Token;
  },

  login(user) {
    localStorage.user = JSON.stringify(user);
    cookie.save("token", user.Token, { domain: 'localhost' });
  },

  logout() {
    delete localStorage.user;
    cookie.remove("token");
  },

  getUser() {
    return JSON.parse(localStorage.user || '{}');
  },

  isCurrentUser(id) {
    var user = this.getUser();
    return user.ID === id;
  }

}