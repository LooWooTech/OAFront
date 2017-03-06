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
    data = data || component.state.data || {};
    var postData = jsonToQueryString(data);
    if (method === HTTP_GET || method === HTTP_DELETE) {
        url += (postData ? "?" + postData : '')
        data = null;
    } else {
        // data = postData;
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
    return Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

module.exports = {
    Abort: utils.AbortRequest,
    //登录
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
            invokeApi(component, 'user/save', HTTP_POST, data, cb, err);
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
        Upload: (component, fileId, cb, err) => {
            invokeApi(component, 'file/upload', HTTP_PUT, fileId, cb, err);
        }
    },
    Missive: {
        SendList: (component, parameter, cb, err) => {
            invokeApi(component, 'missive/sendlist', HTTP_GET, parameter, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, 'missive/save', HTTP_POST, data, cb, err);
        },
        Model: (component, id, cb, err) => {
            invokeApi(component, 'missive/model?id=' + id, HTTP_GET, null, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, 'missive/delete?id=' + id, HTTP_DELETE, null, cb, err);
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
    }
};