import { message } from 'antd';
import utils from '../utils';

const HTTP_GET = "GET"
const HTTP_POST = "POST"
const HTTP_DELETE = "DELETE"
const HTTP_PUT = "PUT"


const host = process.env.NODE_ENV === 'production' ? '/api/' : 'http://localhost:8012/api/';

function invokeApi(path, method, data, callback, onError, async = true) {
    var url = host + path;
    var postData = jsonToQueryString(data);
    if (method === HTTP_GET || method === HTTP_DELETE) {
        url += (postData
            ? "?" + postData
            : '')
        data = null;
    }

    utils.Request(url, method, data, json => {
        if (callback) {
            callback(json);
        }
    }, error => {
        if (onError) {
            onError(error);
        } else {
            let msg = error.ExceptionMessage || error.Message;
            if (msg) {
                message.error(msg);
            }
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
    //断开请求
    Abort: utils.AbortRequest,
    ApiUrl: (path) => {
        return host + path;
    },
    User: {
        Login: (data, cb, err) => invokeApi('user/login', HTTP_GET, data, cb, err),
        //找回密码
        FindPasswordSendMail: (data, cb, err) => {
            invokeApi('user/sendpasswordemail', HTTP_GET, data, cb, err);
        },
        List: (data, cb, err) => {
            invokeApi('user/list', HTTP_GET, data, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('user/save?groupIds=' + (data.GroupIds || []).join(), HTTP_POST, data, cb, err);
        },
        Delete: (id, cb, err) => {
            invokeApi('user/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Form: {
        ID: {
            Missive: 1,
            Car: 2,
            Leave: 3,
            Task: 4,
        },
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
        UploadUrl: (fileId = 0, infoId = 0, name = null) => {
            return `${host}file/upload?infoId=${infoId}&id=${fileId}&name=${name}`;
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
        ConvertToPdf: (id, cb, err) => {
            invokeApi('file/converttopdf?id=' + id, HTTP_GET, null, cb, err);
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
        Model: (flowDataId, cb, err) => {
            invokeApi('flowdata/model?id=' + flowDataId, HTTP_GET, null, cb, err);
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
        UserList: (flowId, nodeId, flowDataId, cb, err) => {
            invokeApi('flowdata/userlist', HTTP_GET, { flowId, nodeId, flowDataId }, cb, err);
        },
        BackList: (infoId, backId, cb, err) => {
            invokeApi('flowdata/backlist', HTTP_GET, { infoId, backId }, cb, err)
        }
    },
    FreeFlowData: {
        Submit: (toUserIds, data, cb, err) => {
            invokeApi(`freeflowdata/submit?infoId=${data.InfoId}&toUserIds=${toUserIds}`, HTTP_POST, data, cb, err);
        },
        UserList: (flowNodeDataId, key, cb, err) => {
            invokeApi(`freeflowdata/userlist?flownodedataId=${flowNodeDataId}&key=${key}`, HTTP_GET, null, cb, err);
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
    Car: {
        List: (cb, err) => {
            invokeApi('Car/list', HTTP_GET, null, cb, err);
        },
        Save: (data, cb, err) => {
            invokeApi('car/save', HTTP_POST, data, cb, err);
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