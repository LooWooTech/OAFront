import $ from './utils'
export default api = {
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
            return $.get('message/read', { id });
        },
        readAll: () => {
            return $.get('message/readall');
        },
        list: (hasRead, page = 1, rows = 10) => {
            return $.get('message/list', { hasRead, page, rows, action: 'receive' });
        },
        delete: (id) => {
            return $.get('message/delete', { id });
        }
    },
    formInfo: {
        model: (id) => {
            return $.get('formInfo/model', { id });
        },
    },
    file: {
        list: (infoId, inline = false) => {
            return $.get('file/list', { infoId, inline, page: 1, rows: 100 })
        }
    },
    missive: {
        list: (parameters) => {
            return $.get('missive/list', parameters)
        },
        model: (id) => {
            return $.get('missive/model', { id });
        },
        report: (id) => {
            return $.get('missive/report', { id });
        }
    },
}