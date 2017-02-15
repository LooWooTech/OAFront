import { browserHistory } from 'react-router'
import auth from './models/auth'
import 'whatwg-fetch'

const getRequestHeaders = () => {
    var headers = new Headers();
    headers.set('token', auth.getToken());
    return headers;
}

const catchRequestError = e => {
    console.log("Oops, error", e);
}

const ajaxRequest = (url, method, data, cb) => {
    fetch(url, {
        method: 'POST',
        headers: getRequestHeaders(),
        data: data
    }).then(response => response.json())
        .then(data => {
            console.log(data)
            cb(data)
        })
        .catch(catchRequestError);
}

module.exports = {
    Redirect(path) {
        browserHistory.push(path);
    },

    POST(url, data, cb) {
        ajaxRequest(url, "POST", data, cb)
    },

    GET(url, cb) {
        ajaxRequest(url, "GET", null, cb)
    },
}