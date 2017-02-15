module.exports = {

  hasLogin() {
    return !!localStorage.token;
  },

  getToken() {
    return localStorage.token;
  },

  logout(cb) {
    delete localStorage.token;
    if (cb) cb()
  },

  getUserName() {
    return localStorage.username;
  },

  submitLogin(formData) {
    //ajax
  }

}