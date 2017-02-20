import { hashHistory } from 'react-router'
import 'whatwg-fetch'
import auth from './models/auth'

const $ = require('jquery')
function ajaxRequest(url, method, data, cb, err) {
    $.ajax({
        method: method,
        data: data,
        dataType: 'json',
        url: url,
        headers: {
            token: auth.getToken(),
        },
        success: function (json, status, xhr) {
            if (cb) {
                cb(json, status, xhr);
            }
        },
        error: function (xhr, status, error) {
            //console.log(arguments);
            if (err) {
                err(error);
            }
        }
    });
}

/*function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
}
function parseJSON(response) {
    return response.json();
}

function fetchRequest(url, method, data, cb, err) {
    var init = {
        method: method,
        headers: {
            'token': auth.getToken()
        },
        credentials:false,
        mode:'cors',
        body: data || {}
    };
    // if (data) {
    //     var formData = new FormData();
    //     Object.keys(data).map(key => formData.append(key, data[key]));
    //     init.body = formData;
    // }
    var request = new Request(url, init);
    console.log(request);
    fetch(request).then(checkStatus)
        .then(parseJSON)
        .then(json => {
            if (cb) {
                cb(json);
            }
        })
        .catch(e => {
            if (err) {
                err(e)
            }
        });
}
*/
module.exports = {
    Redirect(path) {
        hashHistory.push(path);
    },
    Request(url, method, data, cb, err) {
        ajaxRequest(url, method, data, cb, err)
    }
}