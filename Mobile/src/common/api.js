import $ from './utils'
import { HOST, API_HOST } from './config'

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
        },
        submit: (data) => {
            const toUserId = data.ToUserId || 0;
            const infoId = data.InfoId || 0;
            const nextFlowNodeId = data.NextFlowNodeId || 0;
            return $.post('flowdata/submit', { toUserId, infoId, nextFlowNodeId }, data);
        },
        cancel: (infoId) => {
            $.get('flowdata/Cancel', { infoId })
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
        },
        getUrl: (fileId) => {
            return API_HOST + 'file/download?id=' + fileId
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
    task: {
        list: (query) => {
            return $.get('task/list', query)
        },
        model: (id) => {
            return $.get('task/model', { id });
        },
        subTaskList: (taskId) => {
            return $.get('task/subtasklist', { taskId })
        },
        submitSubTask: (id, content) => {
            return $.post('task/submitsubtask', { id }, { content })
        },
        checkSubTask: (id, result, content) => {
            return $.post('task/checksubTask', { id, result }, { content })
        },
        checkList: (taskId, userId) => {
            return $.get('task/checklist', { taskId, userId })
        },
        todoList: (subTaskId) => {
            return $.get('task/todolist', { subTaskId })
        },
        updateTodoStatus: (todoId) => {
            return $.get('task/updatetodostatus', { id: todoId })
        }
    },
}