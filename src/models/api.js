import { message } from 'antd';
import utils from '../utils';

const HTTP_GET = "GET"
const HTTP_POST = "POST"
const HTTP_DELETE = "DELETE"
const HTTP_PUT = "PUT"

const host = 'http://localhost:8012/api/'
function invokeApi(component, path, method, data, callback, onError, async = true) {
    component.setState({ loading: true });
    var url = host + path;
    var postData = jsonToQueryString(data);
    if (method === HTTP_GET || method === HTTP_DELETE) {
        url += (postData ? "?" + postData : '')
        data = null;
    }

    utils.Request(url, method, data, json => {
        component.setState({ loading: false });
        if (callback) {
            callback(json);
        }
    }, error => {
        component.setState({ loading: false });
        if (onError) {
            onError(error);
        } else {
            message.error(error.Message);
        }
        console.log("ERROR:", error);
    }, async);

}
function jsonToQueryString(json) {
    if (!json) return null;
    return Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

module.exports = {
    //formId
    FormType: {
        Missive: 1,
        Leave: 2,
        Task: 3,
    },
    //断开请求
    Abort: utils.AbortRequest,
    ApiUrl: (path) => {
        return host + path;
    },
    User: {
        Login: (component, data, cb, err) =>
            invokeApi(component, 'user/login', HTTP_GET, data, cb, err),
        //找回密码
        FindPasswordSendMail: (component, data, cb, err) => {
            invokeApi(component, 'user/sendpasswordemail', HTTP_GET, data, cb, err);
        },
        List: (component, data, cb, err) => {
            invokeApi(component, 'user/list', HTTP_GET, data, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'user/save?groupIds=' + (data.GroupIds || []).join(), HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'user/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Form: {
        List: (component, cb, err) => {
            invokeApi(component, 'form/list', HTTP_GET, null, cb, err);
        },
    },
    File: {
        FileUrl: (fileId) => {
            return `${host}file/index?id=${fileId}`;
        },
        UploadUrl: (fileId = 0, infoId = 0, name = null) => {
            return `${host}file/upload?infoId=${infoId}&id=${fileId}&name=${name}`;
        },
        Upload: (component, fileId, cb, err) => {
            invokeApi(component, 'file/upload', HTTP_PUT, fileId, cb, err);
        },
        Delete: (component, fileId, cb, err) => {
            invokeApi(component, 'file/delete?id=' + fileId, HTTP_DELETE, null, cb, err);
        },
        UpdateRelation: (component, fileIds, infoId, cb, err) => {
            invokeApi(component, 'file/UpdateRelation', HTTP_POST, { fileIds, infoId }, cb, err);
        }
    },
    FormInfo: {
        List: (component, parameters, cb, err) => {
            invokeApi(component, 'FormInfo/list', HTTP_GET, parameters, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'FormInfo/save', HTTP_POST, data, cb, err);
        },
        Model: (component, id, cb, err) => {
            invokeApi(component, 'FormInfo/model?id=' + id, HTTP_GET, null, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'FormInfo/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Flow: {
        List: (component, cb, err) => {
            invokeApi(component, 'flow/list', HTTP_GET, null, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'flow/save', HTTP_POST, data, cb, err);
        },
        NextNodeUserList: (component, nodeId, cb, err) => {
            invokeApi(component, 'flow/nextnodeuserlist?currentnodeId=' + nodeId, HTTP_GET, null, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'flow/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        SaveNode: (component, data, cb, err) => {
            invokeApi(component, 'flow/savenode', HTTP_POST, data, cb, err);
        },
        DeleteNode: (component, id, cb, err) => {
            invokeApi(component, 'flow/deletenode?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    FlowData: {
        Model: (component, formId, infoId, cb, err) => {
            invokeApi(component, 'flowdata/model', HTTP_GET, { formId, infoId }, cb, err);
        },
        Submit: (component, userId, data, cb, err) => {
            invokeApi(component, 'flowdata/submit?userId=' + userId, HTTP_POST, data, cb, err);
        },
        CanCancel: (component, id, cb, err) => {
            invokeApi(component, 'flowdata/cancencel?id=' + id, HTTP_GET, null, cb, err);
        },
        Cancel: (component, id, cb, err) => {
            invokeApi(component, 'flowdata/cencel?id=' + id, HTTP_GET, null, cb, err);
        },
        CurrentNode: (component, formId, infoId, cb, err) => {
            invokeApi(component, 'flowdata/currentusernode', HTTP_GET, { formId, infoId }, cb, err);
        },
    },
    Group: {
        List: (component, cb, err) => {
            invokeApi(component, 'group/list', HTTP_GET, null, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'group/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'group/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Department: {
        List: (component, cb, err) => {
            invokeApi(component, 'department/list', HTTP_GET, null, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'department/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'department/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Category: {
        List: (component, data, cb, err) => {
            invokeApi(component, 'Category/list', HTTP_GET, data, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'Category/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'Category/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Holiday: {
        List: (component, page, cb, err) => {
            invokeApi(component, 'Holiday/list?page=' + page, HTTP_GET, null, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'Holiday/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'Holiday/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
        GenerateWeeks: (component, year, cb, err) => {
            invokeApi(component, 'Holiday/generateweeks?year=' + year, HTTP_GET, null, cb, err);
        }
    },
    Task: {
        List: (component, parameters, cb, err) => {
            invokeApi(component, 'Task/list', HTTP_GET, parameters, cb, err);
        },
        Model: (component, id, cb, err) => {
            invokeApi(component, 'Task/model?id=' + id, HTTP_GET, null, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'task/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'task/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Leave: {
        List: (component, parameters, cb, err) => {
            invokeApi(component, 'Leave/list', HTTP_GET, parameters, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'Leave/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'Leave/delete?id=' + id, HTTP_DELETE, null, cb, err);
        },
    },
    Attendance: {
        List: (component, parameters, cb, err) => {
            invokeApi(component, 'Attendance/list', HTTP_GET, parameters, cb, err);
        },
        Statistics: (component, parameters, cb, err) => {
            invokeApi(component, 'Attendance/Statistics', HTTP_GET, parameters, cb, err);
        },
    },

};