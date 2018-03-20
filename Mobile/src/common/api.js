import $ from './utils'
import { HOST, API_HOST } from './config'

export default api = {
    client: {
        lastVersion: () => {
            return $.get(HOST + 'client/LastVersion')
        },
        downloadUrl: () => {
            return HOST + 'client/download'
        }
    },
    user: {
        login: (username, password) => {
            return $.get('user/login', { username, password })
        },
        list: (params) => {
            return $.get('user/list', params)
        },
        leaders: (userId = 0) => {
            return $.get('user/parentTitleUserList', { userId })
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
        users: (flowId = 0, flowNodeId = 0, flowDataId = 0, flowStep = 1) => {
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
        }
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
            return API_HOST + 'file/index?id=' + fileId
        },
        getDownloadUrl: (fileId) => {
            return HOST + 'attachment/download?id=' + fileId;
        }
    },
    missive: {
        list: (params) => {
            return $.get('missive/list', params)
        },
        model: (id) => {
            return $.get('missive/model', { id });
        },
        report: (id) => {
            return $.get('missive/report', { id });
        }
    },
    task: {
        list: (params) => {
            return $.get('task/list', params)
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
    attendance: {
        month: (year, month) => {
            return $.get('attendance/month', { year, month })
        },
        leave: (data) => {
            return $.post('attendance/apply', null, data)
        }
    },
    formExtend1: {
        list: (params) => {
            return $.get('formInfoExtend1/list', params)
        },
        approval: (id, result = true, toUserId = 0) => {
            return $.get('FormInfoExtend1/approval', { id, result, toUserId })
        },
        back: (id, backTime) => {
            return $.get('FormInfoExtend1/back', { id, backTime })
        }
    },
    salary: {
        years: (userId) => {
            return $.get('salary/getyears', { userId })
        },
        salaries: (params) => {
            return $.get('salary/salaries', params)
        },
        salaryDatas: (params) => {
            return $.get('salary/salaryDatas', params)
        }
    },
    car: {
        list: () => {
            return $.get('car/list')
        },
        apply: data => {
            return $.post('car/apply', null, data)
        }
    },
    meetingroom: {
        list: () => {
            return $.get('meetingroom/list')
        },
        apply: data => {
            return $.post('meetingroom/apply', null, data)
        }
    },
    seal: {
        list: () => {
            return $.get('seal/list')
        },
        apply: data => {
            return $.post('seal/apply', null, data)
        }
    },
    mail: {
        list: (params) => {
            return $.get('mail/list', params)
        },
        send: (data) => {
            return $.post('mail/send', null, data)
        },
        model: (id) => {
            return $.get('mail/model', { id })
        },
        delete: (id) => {
            return $.delete('mail/delete', { id })
        }
    }
}