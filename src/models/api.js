import { message } from 'antd';
import utils from '../utils';

const HTTP_GET = "GET"
const HTTP_POST = "POST"
const HTTP_DELETE = "DELETE"
const HTTP_PUT = "PUT"

const host = 'http://localhost:8012/api/'
function invokeApi(component, url, method, data, callback, onError) {
    component.setState({ loading: true });
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
    });

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
            invokeApi(component, host + 'user/login', HTTP_GET, data, cb, err),
        //找回密码
        FindPasswordSendMail: (component, data, cb, err) => {
            invokeApi(component, host + 'user/sendpasswordemail', HTTP_GET, data, cb, err);
        },
        List: (component, data, cb, err) => {
            invokeApi(component, 'user/list', HTTP_GET, data, cb, err);
        }
    },
    File: {
        Upload: (component, fileId, cb, err) => {
            invokeApi(component, host + 'file/upload', HTTP_PUT, fileId, cb, err);
        }
    },
    Missive: {
        SendList: (component, parameter, cb, err) => {
            invokeApi(component, host + 'missive/sendlist', HTTP_GET, parameter, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, host + 'missive/save', HTTP_POST, data, cb, err);
        },
        Model: (component, id, cb, err) => {
            invokeApi(component, host + 'missive/model?id=' + id, HTTP_GET, null, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, host + 'missive/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Group: {
        List: (component, cb, err) => {
            invokeApi(component, host + 'group/list', HTTP_GET, null, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, host + 'group/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, host + 'group/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Department: {
        List: (component, cb, err) => {
            invokeApi(component, host + 'department/list', HTTP_GET, null, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, host + 'department/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, host + 'department/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    },
    Category: {
        List: (component, data, cb, err) => {
            invokeApi(component, host + 'Category/list', HTTP_GET, data, cb, err);
        },
        Save: (component, data, cb, err) => {
            invokeApi(component, host + 'Category/save', HTTP_POST, data, cb, err);
        },
        Delete: (component, id, cb, err) => {
            invokeApi(component, host + 'Category/delete?id=' + id, HTTP_DELETE, null, cb, err);
        }
    }
};