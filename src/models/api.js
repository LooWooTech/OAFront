import utils from '../utils'
const HTTP_GET = "GET"
const HTTP_POST = "POST"
const HTTP_DELETE = "DELETE"
const HTTP_PUT = "PUT"

const host = 'http://localhost:8012/api/'
function invokeApi(component, url, method, data, cb, err) {
    component.setState({ loading: true });
    data = data || component.state.data || {};
    var postData = jsonToQueryString(data);
    if (method === HTTP_GET || method === HTTP_DELETE) {
        url = url + "?" + postData;
        data = null;
    }
    utils.Request(url, method, data, json => {
         component.setState({ loading: false });
       if (cb) {
            cb(json);
        }
    }, e => {
        component.setState({ loading: false });
        if (err) {
            err(e);
        }
    });

}
function jsonToQueryString(json) {
    return Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}
module.exports = {
    //登录
    UserLogin: (component, data, cb, err) => {
        //?name=" + data.name + "&pasword=" + data.password
        invokeApi(component, host + "user/login", HTTP_GET, data, cb, err);
    },
    //找回密码
    UserFindPasswordSendMail: (component, data, cb, err) => {
        invokeApi(component, host + "user/sendpasswordemail", HTTP_GET, data, cb, err);
    }
};