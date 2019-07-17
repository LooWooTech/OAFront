import { message } from 'antd';
import utils from '../utils';
import { Forms, Api, HttpMethod } from './config';

function getInnerException(ex) {
    if (ex.InnerException) {
        return getInnerException(ex.InnerException)
    }
    return ex;
}
function invokeApi(path, method, data, callback, onError, async = true) {
    var url = Api.Host + Api.ApiPath + path;
    if (data && (method === HttpMethod.GET || method === HttpMethod.DELETE)) {
        url += (url.indexOf('?') > 0 ? '&' : '?') + utils.jsonToQueryString(data)
        data = null
    }

    utils.Request(url, method, data, json => {
        if (callback) {
            callback(json)
        }
    }, error => {
        const ex = getInnerException(error)
        if (onError) {
            onError(ex);
        } else {
            if (ex) {
                message.error(ex.ExceptionMessage || ex.Message || '未知错误');
            }
        }
    }, async);
}

module.exports = {
    Forms,
    //断开请求
    Abort: utils.AbortRequest,
    ApiUrl: (path) => {
        return Api.Host + Api.ApiPath + path;
    },
    App: {
        qrCodeUrl: Api.Host + "client/qrcode",
    },
    Config: {
        List: (cb, err) => invokeApi('config/list', HttpMethod.GET, null, cb, err),
        Save: (data, cb, err) => invokeApi('config/save', HttpMethod.POST, data, cb, err),
        Delete: (key, cb, err) => invokeApi('config/delete?key=' + key, HttpMethod.DELETE, null, cb, err),
    },
    User: {
        Login: (data, cb, err) => invokeApi('user/login', HttpMethod.GET, data, cb, err),
        EditPassword: (data, cb, err) => invokeApi('user/UpdatePassword', HttpMethod.GET, data, cb, err),
        //找回密码
        FindPasswordSendMail: (data, cb, err) => {
            invokeApi('user/sendpasswordmail', HttpMethod.GET, data, cb, err);
        },
        List: (data, cb, err) => {
            invokeApi('user/list', HttpMethod.GET, data, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('user/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('user/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        RecentList: (cb, err) => {
            invokeApi('user/recentlist', HttpMethod.GET, null, cb, err)
        },
        FlowContacts: (cb, err) => {
            invokeApi('user/flowContactList', HttpMethod.GET, null, cb, err);
        },
        AddFlowContact: (userId, cb, err) => {
            invokeApi('user/saveflowcontact?userid=' + userId, HttpMethod.GET, null, cb, err);
        },
        DeleteFlowContacts: (userIds, cb, err) => {
            invokeApi('user/DeleteFlowContacts?userids=' + userIds.join(), HttpMethod.DELETE, null, cb, err);
        },
        ParentTitleUserList: (userId, cb, err) => {
            invokeApi(`user/ParentTitleUserList?userId=${userId || 0}`, HttpMethod.GET, null, cb, err);
        },
        ResetPassword: (userId, cb, err) => {
            invokeApi(`user/ResetPassword?userId=${userId}`, HttpMethod.GET, null, cb, err);
        }
    },
    Form: {
        GetName: (id) => {
            let key = Object.keys(Forms).find(key => Forms[key].ID === id)
            var form = Forms[key] || {};
            return form.Name || ''
        },
        Model: (formId, cb) => {
            invokeApi('form/model?id=' + formId, HttpMethod.GET, null, cb, null);
        },
        List: (cb, err) => {
            invokeApi('form/list', HttpMethod.GET, null, cb, err);
        },
        GetForm: (formId) => {
            let key = Object.keys(Forms).find(key => Forms[key].ID === formId)
            return Forms[key]
        }
    },
    File: {
        FileUrl: (fileId) => {
            return `${Api.Host}${Api.ApiPath}file/index?id=${fileId}`;
        },
        DownloadUrl: (fileId) => {
            return `${Api.Host}${Api.ApiPath}file/download?id=${fileId}`;
        },
        UploadUrl: (fileId = 0, infoId = 0, formId = 0, name = null, inline = false) => {
            return `${Api.Host}${Api.ApiPath}file/upload?infoId=${infoId}&formId=${formId}&id=${fileId}&name=${name}&inline=${inline}`;
        },
        PreviewUrl: (fileId, disabled = '') => {
            return `${Api.Host}attachment/preview?id=${fileId}&disabled=${disabled}`;
        },

        List: (infoId, inline, cb, err) => {
            var data = { infoId, page: 1, rows: 100 };
            if (inline !== undefined) {
                data.inline = inline;
            }
            invokeApi('file/list', HttpMethod.GET, data, cb, err);
        },
        Delete: (fileId, cb, err) => {
            invokeApi('file/delete?id=' + fileId, HttpMethod.DELETE, null, cb, err);
        },
        Update: (file, cb, err) => {
            invokeApi('file/update', HttpMethod.POST, file, cb, err);
        },
        UpdateRelation: (fileIds, infoId, cb, err) => {
            invokeApi('file/UpdateRelation', HttpMethod.POST, { fileIds, infoId }, cb, err);
        },
    },
    FormInfo: {
        List: (parameters, cb, err) => {
            invokeApi('FormInfo/list', HttpMethod.GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('FormInfo/save', HttpMethod.POST, data, cb, err);
        },
        Model: (id, cb, err) => {
            invokeApi('FormInfo/model?id=' + id, HttpMethod.GET, null, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('FormInfo/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        Remind: (id, cb, err) => {
            invokeApi('FormInfo/Remind?id=' + id, HttpMethod.GET, null, cb, err);
        }
    },
    Sms: {
        Send: (userId, infoId, cb, err) => {
            invokeApi('sms/send?userid=' + userId + '&infoId=' + infoId, HttpMethod.GET, null, cb, err);
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
            invokeApi('flow/list', HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('flow/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('flow/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        SaveNode: (data, cb, err) => {
            invokeApi('flow/savenode', HttpMethod.POST, data, cb, err);
        },
        DeleteNode: (id, cb, err) => {
            invokeApi('flow/deletenode?id=' + id, HttpMethod.DELETE, null, cb, err);
        }
    },
    FlowData: {
        Model: (flowDataId = 0, infoId = 0, cb, err) => {
            invokeApi('flowdata/model', HttpMethod.GET, { id: flowDataId, infoId }, cb, err);
        },
        Submit: (data, cb, err) => {
            let toUserId = data.ToUserId || 0;
            let infoId = data.InfoId || 0;
            let nextFlowNodeId = data.NextFlowNodeId || 0;
            invokeApi('flowdata/submit?toUserId=' + toUserId + '&infoId=' + infoId + '&nextFlowNodeId=' + nextFlowNodeId, HttpMethod.POST, data, cb, err);
        },
        Back: (infoId, cb, err) => {
            invokeApi('flowdata/submit?infoId=' + infoId, HttpMethod.POST, null, cb, err);
        },
        CanComplete: (flowDataId, nodeDataId, cb, err) => {
            invokeApi('flowdata/CanComplete?flowdataId=' + flowDataId + "&nodedataId=" + nodeDataId, HttpMethod.GET, null, cb, err);
        },
        Cancel: (infoId, cb, err) => {
            invokeApi('flowdata/Cancel?infoId=' + infoId, HttpMethod.GET, null, cb, err);
        },
        UserList: (parameters, cb, err) => {
            invokeApi('flowdata/userlist', HttpMethod.GET, parameters, cb, err);
        },
        BackList: (infoId, backId, cb, err) => {
            invokeApi('flowdata/backlist', HttpMethod.GET, { infoId, backId }, cb, err)
        },
        CheckList: (infoId, userId, cb, err) => {
            invokeApi('flowdata/checklist?infoid=' + infoId + '&userid=' + userId, HttpMethod.GET, null, cb, err);
        }
    },
    FreeFlowData: {
        Submit: (flowNodeDataId, infoId, toUserIds, ccUserIds, data, cb, err) => {
            invokeApi(`freeflowdata/submit?flowNodeDataId=${flowNodeDataId}&infoId=${infoId}&toUserIds=${toUserIds}&ccUserIds=${ccUserIds}`, HttpMethod.POST, data, cb, err);
        },
        UserList: (flowNodeDataId, key, cb, err) => {
            invokeApi(`freeflowdata/userlist?flownodedataId=${flowNodeDataId}&key=${key}`, HttpMethod.GET, null, cb, err);
        },
        Complete: (freeFlowDataId, infoId, cb, err) => {
            invokeApi(`freeflowdata/complete?id=${freeFlowDataId}&infoId=${infoId}`, HttpMethod.GET, null, cb, err)
        }
    },
    Group: {
        List: (cb, err) => {
            invokeApi('group/list', HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('group/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('group/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        }
    },
    Department: {
        List: (cb, err) => {
            invokeApi('department/list', HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('department/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('department/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        }
    },
    JobTitle: {
        List: (cb, err) => {
            invokeApi('jobtitle/list', HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('jobtitle/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('jobtitle/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        }
    },
    Category: {
        List: (formId, cb, err) => {
            invokeApi('Category/list?formId=' + formId, HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('Category/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('Category/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        }
    },
    Holiday: {
        List: (page, cb, err) => {
            invokeApi('Holiday/list?page=' + page, HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('Holiday/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('Holiday/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        GenerateWeeks: (year, cb, err) => {
            invokeApi('Holiday/generateweeks?year=' + year, HttpMethod.GET, null, cb, err);
        }
    },
    Missive: {
        List: (parameters, cb, err) => {
            if (!parameters.formId) return
            invokeApi('missive/list', HttpMethod.GET, parameters, cb, err);
        },
        Model: (infoId, cb, err) => {
            invokeApi('missive/model?id=' + infoId, HttpMethod.GET, null, cb, err);
        },
        DeleteContent: (infoId, cb, err) => {
            invokeApi('missive/deletecontent?id=' + infoId, HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('missive/save?formId=' + data.FormId, HttpMethod.POST, data, cb, err);
        },
        GetPreviewFileUrl: (infoId) => {
            return 'file/GetPreviewFileUrl?id=' + infoId
        },
        RedTitleList: (cb, err) => {
            invokeApi('missive/redtitles', HttpMethod.GET, null, cb, err);
        },
        SaveRedTitle: (data, cb, err) => {
            invokeApi('missive/saveredtitle', HttpMethod.POST, data, cb, err);
        },
        DeleteRedTitle: (id, cb, err) => {
            invokeApi('missive/deleteredtitle?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        UpdateImportant: (id, cb, err) => {
            invokeApi('missive/UpdateImportant?id=' + id, HttpMethod.GET, null, cb, err);
        },
        Report: (id, manual, cb, err) => {
            invokeApi('missive/report?id=' + id + '&manual=' + manual, HttpMethod.GET, null, cb, err);
        },
        Transfer: (id, cb, err) => {
            invokeApi('missive/transfer?id=' + id, HttpMethod.GET, null, cb, err);
        }
    },
    FormInfoExtend1: {
        List: (parameters, cb, err) => {
            invokeApi('FormInfoExtend1/List', HttpMethod.GET, parameters, cb, err);
        },
        UpdateApproval: (id, cb, err) => {
            invokeApi('FormInfoExtend1/updateApproval', HttpMethod.GET, { id }, cb, err);
        },
        Approval: (data, cb, err) => {
            invokeApi('FormInfoExtend1/approval', HttpMethod.GET, data, cb, err);
        },
        Back: (infoId, backTime, cb, err) => {
            invokeApi('FormInfoExtend1/Back?id=' + infoId + '&backTime=' + backTime, HttpMethod.GET, null, cb, err);
        }
    },
    Car: {
        List: (cb, err) => {
            invokeApi('Car/list', HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('car/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('car/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        Apply: (data, cb, err) => {
            invokeApi('car/apply', HttpMethod.POST, data, cb, err);
        }
    },
    MeetingRoom: {
        List: (cb, err) => {
            invokeApi('meetingroom/list', HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('meetingroom/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('meetingroom/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        Apply: (data, cb, err) => {
            invokeApi('meetingroom/apply', HttpMethod.POST, data, cb, err);
        }
    },
    Seal: {
        List: (cb, err) => {
            invokeApi('seal/list', HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('seal/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('seal/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        Apply: (data, cb, err) => {
            invokeApi('seal/apply', HttpMethod.POST, data, cb, err);
        }
    },
    Feed: {
        List: (parameters, cb, err) => {
            invokeApi('feed/list', HttpMethod.GET, parameters, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('feed/delete?id=' + id, HttpMethod.GET, null, cb, err);
        },
    },
    Task: {
        List: (parameters, cb, err) => {
            invokeApi('Task/list', HttpMethod.GET, parameters, cb, err);
        },
        Model: (id, cb, err) => {
            invokeApi('Task/model?id=' + id, HttpMethod.GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('task/save', HttpMethod.POST, data, cb, err);
        },
        SubTaskList: (taskId, cb, err) => {
            invokeApi('task/SubTaskList?taskid=' + taskId, HttpMethod.GET, null, cb, err);
        },
        SaveSubTask: (data, cb, err) => {
            invokeApi('task/savesubtask', HttpMethod.POST, data, cb, err);
        },
        SaveSubTasks: (data, cb, err) => {
            invokeApi('task/AddSubTasks', HttpMethod.POST, data, cb, err)
        },
        DeleteSubTask: (subTaskId, cb, err) => {
            invokeApi('task/DeleteSubTask?id=' + subTaskId, HttpMethod.DELETE, null, cb, err);
        },
        SubmitSubTask: (data, cb, err) => {
            invokeApi(`task/submitsubtask?id=${data.ID}`, HttpMethod.POST, { content: data.Content || '' }, cb, err)
        },
        CheckSubTask: (data, cb, err) => {
            invokeApi(`task/checksubtask?id=${data.ID}&result=${data.Result}`, HttpMethod.POST, { content: data.Content || '' }, cb, err);
        },
        TodoList: (subTaskId, cb, err) => {
            invokeApi('task/todolist?subTaskId=' + subTaskId, HttpMethod.GET, null, cb, err);
        },
        SaveTodo: (data, cb, err) => {
            invokeApi('task/savetodo', HttpMethod.POST, data, cb, err);
        },
        UpdateTodoStatus: (todoId, cb, err) => {
            invokeApi('task/updatetodostatus?id=' + todoId, HttpMethod.GET, null, cb, err);
        },
        DeleteTodo: (todoId, cb, err) => {
            invokeApi('task/deletetodo?id=' + todoId, HttpMethod.DELETE, null, cb, err);
        }
    },
    Leave: {
        List: (parameters, cb, err) => {
            invokeApi('Leave/list', HttpMethod.GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('Leave/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('Leave/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
    },
    Attendance: {
        Month: (year, month, cb, err) => {
            invokeApi('Attendance/month', HttpMethod.GET, { year, month }, cb, err);
        },
        CheckInOut: (cb, err) => {
            invokeApi('attendance/checkinout', HttpMethod.GET, null, cb, err);
        },
        Apply: (data, cb, err) => {
            invokeApi('attendance/apply', HttpMethod.POST, data, cb, err);
        },
        Approval: (id, result = true, toUserId = 0, cb, err) => {
            invokeApi('attendance/approval', HttpMethod.GET, { id, result, toUserId }, cb, err);
        },
        Groups: (cb, err) => {
            invokeApi('attendance/groups', HttpMethod.GET, null, cb, err);
        },
        SaveGroup: (data, cb, err) => {
            invokeApi('attendance/savegroup', HttpMethod.POST, data, cb, err);
        }
    },
    Salary: {
        Years: (userId, cb, err) => {
            invokeApi('salary/getyears', HttpMethod.GET, { userId }, cb, err);
        },
        Salaries: (data, cb, err) => {
            invokeApi('salary/salaries', HttpMethod.GET, data, cb, err);
        },
        SalaryDatas: (data, cb, err) => {
            invokeApi('salary/salaryDatas', HttpMethod.GET, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('salary/delete', HttpMethod.DELETE, { id }, cb, err);
        },
        ImportUrl: () => {
            return `salary/upload`;
        },
        Import: (data, cb, err) => {
            let query = utils.jsonToQueryString(data)
            invokeApi('salary/import?' + query, HttpMethod.POST, null, cb, err);
        }
    },
    Message: {
        Unreads: (top, cb, err) => {
            invokeApi('message/list', HttpMethod.GET, { hasRead: false, action: 'receive', page: 1, rows: top }, cb, err);
        },
        Read: (id, cb, err) => {
            invokeApi('message/read?id=' + id, HttpMethod.GET, null, cb, err);
        },
        ReadAll: (cb, err) => {
            invokeApi('message/readall', HttpMethod.GET, null, cb, err);
        },
        histories: (top, cb, err) => {
            invokeApi('message/list', HttpMethod.GET, { hasRead: true, page: 1, rows: top }, cb, err);
        },
        List: (parameters, cb, err) => {
            invokeApi('message/list', HttpMethod.GET, parameters, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('message/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        }
    },
    Mail: {
        List: (parameters, cb, err) => {
            invokeApi('mail/list', HttpMethod.GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('mail/save', HttpMethod.POST, data, cb, err);
        },
        Send: (data, cb, err) => {
            invokeApi('mail/send', HttpMethod.POST, data, cb, err);
        },
        Model: (id, cb, err) => {
            invokeApi('mail/model?id=' + id, HttpMethod.GET, null, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('mail/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        }
    },
    UserInfo: {
        Star: (id, cb, err) => {
            invokeApi('userinfo/star?id=' + id, HttpMethod.GET, null, cb, err);
        },
        Unstar: (id, cb, err) => {
            invokeApi('userinfo/unstar?id=' + id, HttpMethod.GET, null, cb, err);
        },
        Trash: (id, cb, err) => {
            invokeApi('userinfo/trash?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('userinfo/delete?id=' + id, HttpMethod.DELETE, null, cb, err);
        },
        Recovery: (id, cb, err) => {
            invokeApi('userinfo/recovery?id=' + id, HttpMethod.GET, null, cb, err);
        },
        MyList: (formId, cb, err) => {
            invokeApi('userinfo/mylist?formId=' + formId, HttpMethod.GET, null, cb, err);
        }
    },
    Goods: {
        List: (parameters, cb, err) => {
            invokeApi('goods/list', HttpMethod.GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('goods/save', HttpMethod.POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('goods/delete', HttpMethod.DELETE, { id }, cb, err)
        },
        Apply: (data, cb, err) => {
            invokeApi(`goods/apply`, HttpMethod.GET, data, cb, err);
        },
        ApplyList: (data, cb, err) => {
            invokeApi(`goods/applylist`, HttpMethod.GET, data, cb, err);
        },
        Approval: (data, cb, err) => {
            invokeApi('goods/approval', HttpMethod.GET, data, cb, err);
        },
        Register: (goodsId, number, cb, err) => {
            invokeApi(`goods/register`, HttpMethod.GET, { goodsId, number }, cb, err);
        },
        CancelApply: (applyId, cb, err) => {
            invokeApi(`goods/cancelapply`, HttpMethod.GET, { applyId }, cb, err);
        }
    }
};