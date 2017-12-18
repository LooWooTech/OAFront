import $ from './utils'
module.exports = {
    user: {
        login: (username, password) => {
            return $.get('user/login', { username, password })
        },
    },
    message: {
        unreads: (top) => {
            return $.get('message/list', { hasRead: false, action: 'receive', page: 1, rows: top });
        },
        read: (id) => {
            return $.get('message/read?id=' + id);
        },
        readAll: () => {
            return $.get('message/readall');
        },
        list: (parameters) => {
            return $.get('message/list', parameters);
        },
        delete: (id) => {
            return $.get('message/delete?id=' + id);
        }
    }
}