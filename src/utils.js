import { hashHistory } from 'react-router'
import auth from './models/auth'

// function xmlHttpRequest(url, method, data, cb, err) {
//     var req = new XMLHttpRequest();
//     req.onreadystatechange = () => {
//         if (req.readyState === 4) {
//             var json = eval('(' + req.responseText + ')');
//             if (req.status === 200) {
//                 if (cb) {
//                     cb(json);
//                 }
//             }
//             else {
//                 if (err) {
//                     err(json);
//                 } else {
//                     alert(json.Message);
//                 }
//             }
//         }
//     };
//     req.open(method, url, true);
//     req.setRequestHeader("Authorization", auth.getToken());
//     req.setRequestHeader("content-type", "text/plain")
//     req.send(data);
// };

const $ = require('jquery')
let currentRequest = null;
function ajaxRequest(url, method, data, callback, onError) {
    currentRequest = $.ajax({
        method: method,
        data: data,
        url: url,
        headers: {
            authorization: "Basic " + auth.getToken(),
        },
        success: function (json, status, xhr) {
            if (callback) {
                callback(json, status, xhr);
            }
        },
        error: function (xhr, status, error) {
            var json = JSON.parse(xhr.responseText);
            if (onError) {
                onError(json);
            }
        }
    });
}

// function checkStatus(response) {
//     if (response.status >= 200 && response.status < 300) {
//         return response;
//     }

//     const error = new Error(response.statusText);
//     error.response = response;
// }
// function parseJSON(response) {
//     return response.json();
// }

// function fetchRequest(url, method, data, cb, err) {
//     var init = {
//         method: method,
//         headers: {
//             'authorization': "Basic " + auth.getToken()
//         },
//         credentials: false,
//         mode: 'cors'
//     };
//     if (data) {
//         var formData = new FormData();
//         Object.keys(data).map(key => formData.append(key, data[key]));
//         init.body = formData;
//     }
//     var request = new Request(url, init);
//     fetch(request).then(checkStatus)
//         .then(parseJSON)
//         .then(json => {
//             if (cb) {
//                 cb(json);
//             }
//         })
//         .catch(e => {
//             if (err) {
//                 err(e)
//             }
//         });
// }

module.exports = {
    Redirect(path) {
        hashHistory.push(path);
    },
    Request(url, method, data, cb, err) {
        return ajaxRequest(url, method, data, cb, err)
    },
    AbortRequest() {
        currentRequest.abort();
    },
}