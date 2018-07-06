import { message } from 'antd';
import utils from '../utils';

const HTTP_GET = "GET"
const HTTP_POST = "POST"
const HTTP_DELETE = "DELETE"

const host = process.env.NODE_ENV === 'production' ? '/' : 'http://192.168.2.101:8012/';
const apiPath = "api/";
const apiHost = host + apiPath;
const Forms = {
    Missive: { ID: 1, FlowId: 1, Name: '发文', Icon: 'fa fa-file-o', InfoLink: '/missive/edit/1/?id={ID}' },
    ReceiveMissive: { ID: 2, FlowId: 2, Name: '收文', Icon: 'fa fa-file', InfoLink: '/missive/edit/2/?id={ID}' },
    Car: { ID: 3, FlowId: 3, Name: '用车', Icon: 'fa fa-car', InfoLink: '/extend1/approvals/3' },
    Task: { ID: 4, FlowId: 4, Name: '任务', Icon: 'fa fa-clock-o', InfoLink: '/task/edit/?id={ID}' },
    MeetingRoom: { ID: 5, FlowId: 5, Name: '会议室', Icon: 'fa fa-television', InfoLink: '/extend1/approvals/5' },
    Seal: { ID: 6, FlowId: 6, Name: '印章', Icon: 'fa fa-dot-circle-o', InfoLink: '/extend1/approvals/6' },
    Leave: { ID: 7, FlowId: 7, Name: '请假', Icon: 'fa fa-calendar-check-o', InfoLink: '/extend1/approvals/7' },
    Mail: { ID: 8, Name: '邮件', Icon: 'fa fa-envelope-o', InfoLink: '/mail/detail?id={ID}' },
    Goods: { ID: 9, FlowId: 8, Name: '物品', Icon: 'fa fa-box', InfoLink: '/goods/approvals' }
};

function getExceptionMessage(ex) {
    if (ex.InnerException) {
        return getExceptionMessage(ex.InnerException)
    }
    return ex.ExceptionMessage || ex.Message || '未知错误'
}
function invokeApi(path, method, data, callback, onError, async = true) {
    var url = host + apiPath + path;
    if (data && (method === HTTP_GET || method === HTTP_DELETE)) {
        url += (url.indexOf('?') > 0 ? '&' : '?') + utils.jsonToQueryString(data)
        data = null
    }

    utils.Request(url, method, data, json => {
        if (callback) {
            callback(json)
        }
    }, error => {
        if (onError) {
            onError(error);
        } else {
            var msg = getExceptionMessage(error);
            if (msg) {
                message.error(msg);
            }
        }
        console.log("ERROR:", error);
    }, async);
}

module.exports = {
    Forms,
    //断开请求
    Abort: utils.AbortRequest,
    ApiUrl: (path) => {
        return host + apiPath + path;
    },
    App: {
        qrCodeUrl: host + "client/qrcode",
    },
    Config: {
        List: (cb, err) => invokeApi('config/list', HTTP_GET, null, cb, err),
        Save: (data, cb, err) => invokeApi('config/save', HTTP_POST, data, cb, err),
        Delete: (key, cb, err) => invokeApi('config/delete?key=' + key, HTTP_DELETE, null, cb, err),
    },
    User: {
        Login: (data, cb, err) => invokeApi('user/login', HTTP_GET, data, cb, err),
        EditPassword: (data, cb, err) => invokeApi('user/UpdatePassword', HTTP_GET, data, cb, err),
        //找回密码
        FindPasswordSendMail: (data, cb, err) => {
            invokeApi('user/sendpasswordmail', HTTP_GET, data, cb, err);
        },
        List: (data, cb, err) => {
            invokeApi('user/list', HTTP_GET, data, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('user/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('user/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        RecentList: (cb, err) => {
            invokeApi('user/recentlist', HTTP_GET, null, cb, err)
        },
        FlowContacts: (cb, err) => {
            invokeApi('user/flowContactList', HTTP_GET, null, cb, err);
        },
        AddFlowContact: (userId, cb, err) => {
            invokeApi('user/saveflowcontact?userid=' + userId, HTTP_GET, null, cb, err);
        },
        DeleteFlowContacts: (userIds, cb, err) => {
            invokeApi('user/DeleteFlowContacts?userids=' + userIds.join(), HTTP_DELETE, null, cb, err);
        },
        ParentTitleUserList: (userId, cb, err) => {
            invokeApi(`user/ParentTitleUserList?userId=${userId || 0}`, HTTP_GET, null, cb, err);
        }
    },
    Form: {
        GetName: (id) => {
            let key = Object.keys(Forms).find(key => Forms[key].ID === id)
            var form = Forms[key] || {};
            return form.Name || ''
        },
        Model: (formId, cb) => {
            invokeApi('form/model?id=' + formId, HTTP_GET, null, cb, null);
        },
        List: (cb, err) => {
            invokeApi('form/list', HTTP_GET, null, cb, err);
        },
        GetForm: (formId) => {
            let key = Object.keys(Forms).find(key => Forms[key].ID === formId)
            return Forms[key]
        }
    },
    File: {
        FileUrl: (fileId) => {
            return `${apiHost}file/index?id=${fileId}`;
        },
        DownloadUrl: (fileId) => {
            return `${apiHost}file/download?id=${fileId}`;
        },
        UploadUrl: (fileId = 0, infoId = 0, formId = 0, name = null, inline = false) => {
            return `${apiHost}file/upload?infoId=${infoId}&formId=${formId}&id=${fileId}&name=${name}&inline=${inline}`;
        },
        PreviewUrl: (infoId) => {
            return `${host}attachment/preview?id=${infoId}`;
        },

        List: (infoId, inline, cb, err) => {
            var data = { infoId, page: 1, rows: 100 };
            if (inline !== undefined) {
                data.inline = inline;
            }
            invokeApi('file/list', HTTP_GET, data, cb, err);
        },
        Delete: (fileId, cb, err) => {
            invokeApi('file/delete?id=' + fileId, HTTP_DELETE, null, cb, err);
        },
        Update: (file, cb, err) => {
            invokeApi('file/update', HTTP_POST, file, cb, err);
        },
        UpdateRelation: (fileIds, infoId, cb, err) => {
            invokeApi('file/UpdateRelation', HTTP_POST, { fileIds, infoId }, cb, err);
        },
    },
    FormInfo: {
        List: (parameters, cb, err) => {
            invokeApi('FormInfo/list', HTTP_GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('FormInfo/save', HTTP_POST, data, cb, err);
        },
        Model: (id, cb, err) => {
            invokeApi('FormInfo/model?id=' + id, HTTP_GET, null, data => {
                if (data.flowNodeData) {
                    data.flowNodeData = data.model.FlowData.Nodes.find(n => n.$id === data.flowNodeData.$ref);
                }

                if (data.freeFlowNodeData) {
                    data.freeFlowNodeData = data.flowNodeData.FreeFlowData.Nodes.find(n => n.$id === data.freeFlowNodeData.$ref);
                }
                if (cb) {
                    cb(data)
                }
            }, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('FormInfo/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        Remind: (id, cb, err) => {
            invokeApi('FormInfo/Remind?id=' + id, HTTP_GET, null, cb, err);
        }
    },
    Sms: {
        Send: (userId, infoId, cb, err) => {
            invokeApi('sms/send?userid=' + userId + '&infoId=' + infoId, HTTP_GET, null, cb, err);
        }
    },
    Flow: {
        ID: {
            Missive: 1,
            Car: 2,
            Leave: 3,
            Task: 4,
        },
        List: (cb, err) => {
            invokeApi('flow/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('flow/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('flow/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        SaveNode: (data, cb, err) => {
            invokeApi('flow/savenode', HTTP_POST, data, cb, err);
        },
        DeleteNode: (id, cb, err) => {
            invokeApi('flow/deletenode?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    FlowData: {
        Model: (flowDataId = 0, infoId = 0, cb, err) => {
            invokeApi('flowdata/model', HTTP_GET, { id: flowDataId, infoId }, data => {
                if (data.flowNodeData) {
                    data.flowNodeData = data.flowData.Nodes.find(n => n.$id === data.flowNodeData.$ref);
                }

                if (data.freeFlowNodeData) {
                    data.freeFlowNodeData = data.flowNodeData.FreeFlowData.Nodes.find(n => n.$id === data.freeFlowNodeData.$ref);
                }
                if (cb) {
                    cb(data)
                }
            }, err);
        },
        Submit: (data, cb, err) => {
            let toUserId = data.ToUserId || 0;
            let infoId = data.InfoId || 0;
            let nextFlowNodeId = data.NextFlowNodeId || 0;
            invokeApi('flowdata/submit?toUserId=' + toUserId + '&infoId=' + infoId + '&nextFlowNodeId=' + nextFlowNodeId, HTTP_POST, data, cb, err);
        },
        Back: (infoId, cb, err) => {
            invokeApi('flowdata/submit?infoId=' + infoId, HTTP_POST, null, cb, err);
        },
        CanComplete: (flowDataId, nodeDataId, cb, err) => {
            invokeApi('flowdata/CanComplete?flowdataId=' + flowDataId + "&nodedataId=" + nodeDataId, HTTP_GET, null, cb, err);
        },
        Cancel: (infoId, cb, err) => {
            invokeApi('flowdata/Cancel?infoId=' + infoId, HTTP_GET, null, cb, err);
        },
        UserList: (parameters, cb, err) => {
            invokeApi('flowdata/userlist', HTTP_GET, parameters, cb, err);
        },
        BackList: (infoId, backId, cb, err) => {
            invokeApi('flowdata/backlist', HTTP_GET, { infoId, backId }, cb, err)
        },
        CheckList: (infoId, userId, cb, err) => {
            invokeApi('flowdata/checklist?infoid=' + infoId + '&userid=' + userId, HTTP_GET, null, cb, err);
        }
    },
    FreeFlowData: {
        Submit: (flowNodeDataId, infoId, toUserIds, ccUserIds, data, cb, err) => {
            invokeApi(`freeflowdata/submit?flowNodeDataId=${flowNodeDataId}&infoId=${infoId}&toUserIds=${toUserIds}&ccUserIds=${ccUserIds}`, HTTP_POST, data, cb, err);
        },
        UserList: (flowNodeDataId, key, cb, err) => {
            invokeApi(`freeflowdata/userlist?flownodedataId=${flowNodeDataId}&key=${key}`, HTTP_GET, null, cb, err);
        },
        Complete: (freeFlowDataId, infoId, cb, err) => {
            invokeApi(`freeflowdata/complete?id=${freeFlowDataId}&infoId=${infoId}`, HTTP_GET, null, cb, err)
        }
    },
    Group: {
        List: (cb, err) => {
            invokeApi('group/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('group/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('group/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Department: {
        List: (cb, err) => {
            invokeApi('department/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('department/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('department/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    JobTitle: {
        List: (cb, err) => {
            invokeApi('jobtitle/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('jobtitle/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('jobtitle/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Category: {
        List: (formId, cb, err) => {
            invokeApi('Category/list?formId=' + formId, HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('Category/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('Category/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Holiday: {
        List: (page, cb, err) => {
            invokeApi('Holiday/list?page=' + page, HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('Holiday/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('Holiday/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        GenerateWeeks: (year, cb, err) => {
            invokeApi('Holiday/generateweeks?year=' + year, HTTP_GET, null, cb, err);
        }
    },
    Missive: {
        List: (parameters, cb, err) => {
            if (!parameters.formId) return
            invokeApi('missive/list', HTTP_GET, parameters, cb, err);
        },
        Model: (infoId, cb, err) => {
            invokeApi('missive/model?id=' + infoId, HTTP_GET, null, cb, err);
        },
        DeleteContent: (infoId, cb, err) => {
            invokeApi('missive/deletecontent?id=' + infoId, HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('missive/save?formId=' + data.FormId, HTTP_POST, data, cb, err);
        },
        GetPreviewFileUrl: (infoId) => {
            return 'file/GetPreviewFileUrl?id=' + infoId
        },
        RedTitleList: (cb, err) => {
            invokeApi('missive/redtitles', HTTP_GET, null, cb, err);
        },
        SaveRedTitle: (data, cb, err) => {
            invokeApi('missive/saveredtitle', HTTP_POST, data, cb, err);
        },
        DeleteRedTitle: (id, cb, err) => {
            invokeApi('missive/deleteredtitle?id=' + id, HTTP_DELETE, null, cb, err);
        },
        UpdateImportant: (id, cb, err) => {
            invokeApi('missive/UpdateImportant?id=' + id, HTTP_GET, null, cb, err);
        },
        Report: (id, cb, err) => {
            invokeApi('missive/report?id=' + id, HTTP_GET, null, cb, err);
        }
    },
    FormInfoExtend1: {
        List: (parameters, cb, err) => {
            invokeApi('FormInfoExtend1/List', HTTP_GET, parameters, cb, err);
        },
        UpdateApproval: (id, cb, err) => {
            invokeApi('FormInfoExtend1/updateApproval', HTTP_GET, { id }, cb, err);
        },
        Approval: (data, cb, err) => {
            invokeApi('FormInfoExtend1/approval', HTTP_GET, data, cb, err);
        },
        Back: (infoId, backTime, cb, err) => {
            invokeApi('FormInfoExtend1/Back?id=' + infoId + '&backTime=' + backTime, HTTP_GET, null, cb, err);
        }
    },
    Car: {
        List: (cb, err) => {
            invokeApi('Car/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('car/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('car/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        Apply: (data, cb, err) => {
            invokeApi('car/apply', HTTP_POST, data, cb, err);
        }
    },
    MeetingRoom: {
        List: (cb, err) => {
            invokeApi('meetingroom/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('meetingroom/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('meetingroom/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        Apply: (data, cb, err) => {
            invokeApi('meetingroom/apply', HTTP_POST, data, cb, err);
        }
    },
    Seal: {
        List: (cb, err) => {
            invokeApi('seal/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('seal/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('seal/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        Apply: (data, cb, err) => {
            invokeApi('seal/apply', HTTP_POST, data, cb, err);
        }
    },
    Feed: {
        List: (parameters, cb, err) => {
            invokeApi('feed/list', HTTP_GET, parameters, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('feed/delete?id=' + id, HTTP_GET, null, cb, err);
        },
    },
    Task: {
        List: (parameters, cb, err) => {
            invokeApi('Task/list', HTTP_GET, parameters, cb, err);
        },
        Model: (id, cb, err) => {
            invokeApi('Task/model?id=' + id, HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('task/save', HTTP_POST, data, cb, err);
        },
        SubTaskList: (taskId, cb, err) => {
            invokeApi('task/SubTaskList?taskid=' + taskId, HTTP_GET, null, cb, err);
        },
        SaveSubTask: (data, cb, err) => {
            invokeApi('task/savesubtask', HTTP_POST, data, cb, err);
        },
        SaveSubTasks: (data, cb, err) => {
            invokeApi('task/AddSubTasks', HTTP_POST, data, cb, err)
        },
        DeleteSubTask: (subTaskId, cb, err) => {
            invokeApi('task/DeleteSubTask?id=' + subTaskId, HTTP_DELETE, null, cb, err);
        },
        SubmitSubTask: (data, cb, err) => {
            invokeApi(`task/submitsubtask?id=${data.ID}`, HTTP_POST, { content: data.Content || '' }, cb, err)
        },
        CheckSubTask: (data, cb, err) => {
            invokeApi(`task/checksubtask?id=${data.ID}&result=${data.Result}`, HTTP_POST, { content: data.Content || '' }, cb, err);
        },
        TodoList: (subTaskId, cb, err) => {
            invokeApi('task/todolist?subTaskId=' + subTaskId, HTTP_GET, null, cb, err);
        },
        SaveTodo: (data, cb, err) => {
            invokeApi('task/savetodo', HTTP_POST, data, cb, err);
        },
        UpdateTodoStatus: (todoId, cb, err) => {
            invokeApi('task/updatetodostatus?id=' + todoId, HTTP_GET, null, cb, err);
        },
        DeleteTodo: (todoId, cb, err) => {
            invokeApi('task/deletetodo?id=' + todoId, HTTP_DELETE, null, cb, err);
        }
    },
    Leave: {
        List: (parameters, cb, err) => {
            invokeApi('Leave/list', HTTP_GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('Leave/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('Leave/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
    },
    Attendance: {
        Month: (year, month, cb, err) => {
            invokeApi('Attendance/month', HTTP_GET, { year, month }, cb, err);
        },
        CheckInOut: (cb, err) => {
            invokeApi('attendance/checkinout', HTTP_GET, null, cb, err);
        },
        Apply: (data, cb, err) => {
            invokeApi('attendance/apply', HTTP_POST, data, cb, err);
        },
        Approval: (id, result = true, toUserId = 0, cb, err) => {
            invokeApi('attendance/approval', HTTP_GET, { id, result, toUserId }, cb, err);
        },
        Groups: (cb, err) => {
            invokeApi('attendance/groups', HTTP_GET, null, cb, err);
        },
        SaveGroup: (data, cb, err) => {
            invokeApi('attendance/savegroup', HTTP_POST, data, cb, err);
        }
    },
    Salary: {
        Years: (userId, cb, err) => {
            invokeApi('salary/getyears', HTTP_GET, { userId }, cb, err);
        },
        Salaries: (data, cb, err) => {
            invokeApi('salary/salaries', HTTP_GET, data, cb, err);
        },
        SalaryDatas: (data, cb, err) => {
            invokeApi('salary/salaryDatas', HTTP_GET, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('salary/delete', HTTP_DELETE, { id }, cb, err);
        },
        ImportUrl: () => {
            return `${apiHost}salary/upload`;
        },
        Import: (data, cb, err) => {
            let query = utils.jsonToQueryString(data)
            invokeApi('salary/import?' + query, HTTP_POST, null, cb, err);
        }
    },
    Message: {
        Unreads: (top, cb, err) => {
            invokeApi('message/list', HTTP_GET, { hasRead: false, action: 'receive', page: 1, rows: top }, cb, err);
        },
        Read: (id, cb, err) => {
            invokeApi('message/read?id=' + id, HTTP_GET, null, cb, err);
        },
        ReadAll: (cb, err) => {
            invokeApi('message/readall', HTTP_GET, null, cb, err);
        },
        histories: (top, cb, err) => {
            invokeApi('message/list', HTTP_GET, { hasRead: true, page: 1, rows: top }, cb, err);
        },
        List: (parameters, cb, err) => {
            invokeApi('message/list', HTTP_GET, parameters, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('message/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Mail: {
        List: (parameters, cb, err) => {
            invokeApi('mail/list', HTTP_GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('mail/save', HTTP_POST, data, cb, err);
        },
        Send: (data, cb, err) => {
            invokeApi('mail/send', HTTP_POST, data, cb, err);
        },
        Model: (id, cb, err) => {
            invokeApi('mail/model?id=' + id, HTTP_GET, null, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('mail/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    UserInfo: {
        Star: (id, cb, err) => {
            invokeApi('userinfo/star?id=' + id, HTTP_GET, null, cb, err);
        },
        Unstar: (id, cb, err) => {
            invokeApi('userinfo/unstar?id=' + id, HTTP_GET, null, cb, err);
        },
        Trash: (id, cb, err) => {
            invokeApi('userinfo/trash?id=' + id, HTTP_DELETE, null, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('userinfo/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        Recovery: (id, cb, err) => {
            invokeApi('userinfo/recovery?id=' + id, HTTP_GET, null, cb, err);
        },
        MyList: (formId, cb, err) => {
            invokeApi('userinfo/mylist?formId=' + formId, HTTP_GET, null, cb, err);
        }
    },
    Goods: {
        List: (parameters, cb, err) => {
            invokeApi('goods/list', HTTP_GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('goods/save', HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('goods/delete', HTTP_DELETE, { id }, cb, err)
        },
        Apply: (data, cb, err) => {
            invokeApi(`goods/apply`, HTTP_GET, data, cb, err);
        },
        ApplyList: (data, cb, err) => {
            invokeApi(`goods/applylist`, HTTP_GET, data, cb, err);
        },
        Approval: (data, cb, err) => {
            invokeApi('goods/approval', HTTP_GET, data, cb, err);
        },
        Register: (goodsId, number, cb, err) => {
            invokeApi(`goods/register`, HTTP_GET, { goodsId, number }, cb, err);
        },
        CancelApply: (applyId, cb, err) => {
            invokeApi(`goods/cancelapply`, HTTP_GET, { applyId }, cb, err);
        }
    }
};