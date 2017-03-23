import { hashHistory } from 'react-router'

let currentRequest = null;
function xmlHttpRequest(url, method, data, cb, err) {
    var req = currentRequest = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            var json = JSON.parse(req.responseText || '{}');
            if (req.status === 200) {
                if (cb) {
                    cb(json);
                }
            }
            else {
                if (err) {
                    err(json);
                } else {
                    alert(json.Message);
                }
            }
        }
    };
    req.withCredentials = true;
    req.open(method, url, true);
    //req.setRequestHeader("Authorization", auth.getToken());
    req.setRequestHeader("content-type", "application/json")
    var postData = data ? JSON.stringify(data) : null;
    req.send(postData);
};

// const $ = require('jquery')
// let currentRequest = null;

// function ajaxRequest(url, method, data, callback, onError, async) {
//     currentRequest = $.ajax({
//         method: method,
//         contentType: 'application/json',
//         data: JSON.stringify(data),
//         url: url,
//         async: async,
//         headers: {
//             token: auth.getToken(),
//         },
//         success: function (json, status, xhr) {
//             if (callback) {
//                 callback(json, status, xhr);
//             }
//         },
//         error: function (xhr, status, error) {
//             var json = { Message: error };
//             try {
//                 json = JSON.parse(xhr.responseText);
//             } catch (ex) {

//             }
//             if (onError) {
//                 onError(json);
//             }
//         }
//     });
// }

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
    Request(url, method, data, cb, err, async) {
        return xmlHttpRequest(url, method, data, cb, err, async)
    },
    AbortRequest() {
        currentRequest.abort();
    },
}