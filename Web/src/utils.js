import React from 'react'
import { hashHistory } from 'react-router'
import auth from './models/auth'
let currentRequest = null;
function xmlHttpRequest(url, method, data, cb, err) {
    var req = currentRequest = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === 4) {

            var json = req.responseText || '{}';
            try {
                json = JSON.parse(json);
            } catch (ex) {
            }
            if (req.status === 200) {
                if (cb) {
                    cb(json);
                }
            }
            else if (req.status === 204) {
                cb();
                return;
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
    req.setRequestHeader("token", auth.getToken());
    req.setRequestHeader("Content-Type", "application/json")
    var postData = data ? JSON.stringify(data) : null;
    req.send(postData);
};
let newlineRegex = /(\r\n|\r|\n)/g;
module.exports = {
    Redirect(path) {
        hashHistory.push(path);
    },
    ReloadPage(parameters) {
        parameters = parameters || {}
        let hash = window.location.hash;
        let pathAndQuery = hash.indexOf('#') > -1 ? window.location.hash.substring(1) : '/';
        let queryIndex = pathAndQuery.indexOf('?')
        let queryString = queryIndex > -1 ? pathAndQuery.substring(queryIndex + 1) : ''
        let params = this.queryStringToJson(queryString)
        params = { ...params, ...parameters };
        let newQueryString = this.jsonToQueryString(params)
        let path = queryIndex === -1 ? pathAndQuery : pathAndQuery.substring(0, queryIndex)
        let newUrl = path + '?' + newQueryString
        this.Redirect(newUrl)
    },
    queryStringToJson(str) {
        let json = {}
        str.split('&').map(kv => {
            let arr = kv.split('=')
            if (arr.length === 2) {
                json[arr[0]] = decodeURIComponent(arr[1])
            }
            return json
        })
        return json;
    },
    jsonToQueryString(json) {
        if (!json)
            return null;
        return Object
            .keys(json)
            .map(key => key + '=' + encodeURIComponent(json[key]))
            .join('&');
    },
    Request(url, method, data, cb, err, async) {
        return xmlHttpRequest(url, method, data, cb, err, async)
    },
    AbortRequest() {
        currentRequest.abort();
    },
    GoBack() {
        hashHistory.goBack();
    },
    NewLineToBreak(str) {
        if (typeof str === 'number') {
            return str;
        } else if (typeof str !== 'string') {
            return '';
        }

        return str.split(newlineRegex).map((line, index) => <span key={index}>{line}{line.match(newlineRegex) ? <br /> : null}</span>);
    }
}