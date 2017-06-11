import { message } from 'antd';
import utils from '../utils';

const HTTP_GET = "GET"
const HTTP_POST = "POST"
const HTTP_DELETE = "DELETE"
const HTTP_PUT = "PUT"


const host = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8012/';
const apiPath = "api/";
const apiHost = host + apiPath;
const Forms = {
    Missive: { ID: 1, Name: '公文发文' },
    ReceiveMissive: { ID: 2, Name: '公文收文' },
    Car: { ID: 3, Name: '公车申请' },
    Task: { ID: 4, Name: '任务' },
    Leave: { ID: 5, Name: '请假' },
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
        url += (url.indexOf('?') > 0 ? '&' : '?') + jsonToQueryString(data)
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
            message.error(getExceptionMessage(error));
        }
        console.log("ERROR:", error);
    }, async);
}
function jsonToQueryString(json) {
    if (!json)
        return null;
    return Object
        .keys(json)
        .map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
        })
        .join('&');
}
module.exports = {
    Forms,
    //断开请求
    Abort: utils.AbortRequest,
    ApiUrl: (path) => {
        return host + apiPath + path;
    },
    User: {
        Login: (data, cb, err) => invokeApi('user/login', HTTP_GET, data, cb, err),
        EditPassword: (data, cb, err) => invokeApi('user/UpdatePassword', HTTP_GET, data, cb, err),
        //找回密码
        FindPasswordSendMail: (data, cb, err) => {
            invokeApi('user/sendpasswordemail', HTTP_GET, data, cb, err);
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
        }
    },
    Form: {
        Model: (formId, cb) => {
            invokeApi('form/model?id=' + formId, HTTP_GET, null, cb, null);
        },
        List: (cb, err) => {
            invokeApi('form/list', HTTP_GET, null, cb, err);
        }
    },
    File: {
        FileUrl: (fileId) => {
            return `${host}file/index?id=${fileId}`;
        },
        List: (infoId, inline, cb, err) => {
            var data = { infoId, page: 1, rows: 100 };
            if (inline !== undefined) {
                data.inline = inline;
            }
            invokeApi('file/list', HTTP_GET, data, cb, err);
        },
        UploadUrl: (fileId = 0, infoId = 0, name = null, inline = false) => {
            return `${apiHost}file/upload?infoId=${infoId}&id=${fileId}&name=${name}&inline=${inline}`;
        },
        Upload: (fileId, cb, err) => {
            invokeApi('file/upload', HTTP_PUT, fileId, cb, err);
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
        GetPreviewFileUrl: (fileId) => {
            return host + 'word/get/?id=' + fileId
        }
    },
    FormInfo: {
        List: (parameters, cb, err) => {
            invokeApi('FormInfo/list', HTTP_GET, parameters, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('FormInfo/save', HTTP_POST, data, cb, err);
        },
        Model: (id, cb, err) => {
            invokeApi('FormInfo/model?id=' + id, HTTP_GET, null, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('FormInfo/delete?id=' + id, HTTP_DELETE, null, cb, err);
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
            invokeApi('flowdata/model', HTTP_GET, { id: flowDataId, infoId }, cb, err);
        },
        Submit: (toUserId, infoId, data, cb, err) => {
            invokeApi('flowdata/submit?toUserId=' + toUserId + '&infoId=' + infoId, HTTP_POST, data, cb, err);
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
        }
    },
    FreeFlowData: {
        Submit: (flowNodeDataId, infoId, toUserIds, data, cb, err) => {
            invokeApi(`freeflowdata/submit?flowNodeDataId=${flowNodeDataId}&infoId=${infoId}&toUserIds=${toUserIds}`, HTTP_POST, data, cb, err);
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
        List: (data, cb, err) => {
            invokeApi('Category/list', HTTP_GET, data, cb, err);
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
        Get: (infoId, cb, err) => {
            invokeApi('missive/get?id=' + infoId, HTTP_GET, null, cb, err);
        },
        DeleteWord: (infoId, cb, err) => {
            invokeApi('missive/deleteWord?id=' + infoId, HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('missive/save?formId=' + data.FormId, HTTP_POST, data, cb, err);
        },
        GetPreviewFileUrl: (infoId) => {
            return 'file/GetPreviewFileUrl?id=' + infoId
        }
    },
    Car: {
        List: (cb, err) => {
            invokeApi('Car/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('car/save', HTTP_POST, data, cb, err);
        },
        ApplyList: (parameters, cb, err) => {
            invokeApi('car/carapplies', HTTP_GET, parameters, cb, err);
        },
        Apply: (carId, toUserId, data, cb, err) => {
            invokeApi('car/apply?carId=' + carId + '&toUserId=' + toUserId, HTTP_POST, data, cb, err);
        },
        UpdateStatus: (carId, status, cb, err) => {
            invokeApi('car/update?carId=' + carId + '&status=' + status, HTTP_GET, null, cb, err);
        },
        Approval: (id, cb, err) => {
            invokeApi('car/approval', HTTP_GET, null, cb, err);
        }
    },
    Feed: {
        List: (userId, page, rows, cb, err) => {
            invokeApi('feed/list', HTTP_GET, { userId, page, rows }, cb, err);
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
        Delete: (id, cb, err) => {
            invokeApi('task/delete?id=' + id, HTTP_DELETE, null, cb, err);
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
        }
    },
    Attendance: {
        List: (parameters, cb, err) => {
            invokeApi('Attendance/list', HTTP_GET, parameters, cb, err);
        },
        Statistics: (parameters, cb, err) => {
            invokeApi('Attendance/Statistics', HTTP_GET, parameters, cb, err);
        }
    }
};