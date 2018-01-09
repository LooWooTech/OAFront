import $ from './utils'
export default api = {
    user: {
        login: (username, password) => {
            return $.get('user/login', { username, password })
        },
        list: (query) => {
            return $.get('user/list', query)
        }
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
    flowData: {
        users: (flowId, flowNodeId, flowDataId, flowStep = 1) => {
            return $.get('flowdata/userlist', { flowId, flowNodeId, flowDataId, flowStep })
        }
    },
    freeflowData: {
        submit: (infoId, flowNodeDataId, toUserIds = '', ccUserIds = '', formData) => {
            return $.post('freeflowdata/submit', { infoId, flowNodeDataId, toUserIds, ccUserIds }, formData)
        },
        complete: (freeflowDataId, infoId) => {
            return $.get('freeflowdata/complete', { id: freeflowDataId, infoId })
        },
        users: (flowNodeDataId, key = '') => {
            return $.get('freeflowdata/userlist', { flowNodeDataId, key })
        }
    },
    formInfo: {
        model: (id) => {
            return $.get('formInfo/model', { id });
        },
    },
    sms: {
        send: (userIds, infoId) => {
            return $.get('sms/send', { userId: userIds.join(), infoId })
        }
    },
    file: {
        list: (infoId, inline = false) => {
            return $.get('file/list', { infoId, inline, page: 1, rows: 100 })
        }
    },
    missive: {
        list: (query) => {
            return $.get('missive/list', query)
        },
        model: (id) => {
            return $.get('missive/model', { id });
        },
        report: (id) => {
            return $.get('missive/report', { id });
        }
    },
}