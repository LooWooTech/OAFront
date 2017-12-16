import $ from './utils'
module.exports = {
    User: {
        Login: (username, password) => {
            return $.get('user/login', { username, password })
        },
    }
}