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
        list: (hasRead, page = 1, rows = 10) => {
            return $.get('message/list', { hasRead, page, rows, action: 'receive' });
        },
        delete: (id) => {
            return $.get('message/delete?id=' + id);
        }
    },
    missive: {
        list: (parameters) => {
            return $.get('missive/list', parameters)
        },
        model: (id) => {
            return $.get('missive/model?id=' + id)
        },
        report: (id) => {
            return $.get('missive/report?id=' + id)
        }
    },
}