import $ from './utils'
export default api = {
    user: {
        login: (username, password) => {
            return $.get('user/login', { username, password })
        },
        list: (parameters) => {
            return $.get('user/list', parameters)
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
        submit: (freeflowNodeDataId, infoId, flowNodeDataId, toUserIds, ccUserIds) => {
            return $.post(`freeflowdata/submit?flowNodeDataId=${flowNodeDataId}&infoId=${infoId}&toUserIds=${toUserIds}&ccUserIds=${ccUserIds}`, { ID: freeflowNodeDataId })
        },
        complete: (freeflowDataId, infoId) => {
            return $.get(`freeflowdata/complete?id=${freeFlowDataId}&infoId=${infoId}`)
        },
        users: (flowNodeDataId, key = '') => {
            return $.get(`freeflowdata/userlist?flownodedataId=${flowNodeDataId}&key=${key}`)
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