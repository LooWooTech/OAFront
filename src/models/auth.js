import cookie from 'react-cookie'

module.exports = {

  hasLogin() {
    return this.getToken();
  },

  getToken() {
    return cookie.select(/token/ig);
    //return this.getUser().Token;
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
    var user =  JSON.parse(localStorage.user || '{}');
    //console.log(user);
    return user;
  },

  isCurrentUser(id) {
    var user = this.getUser();
    return user.ID === id;
  }

}