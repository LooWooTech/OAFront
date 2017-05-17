import { hashHistory } from 'react-router'

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
    //req.setRequestHeader("Authorization", auth.getToken());
    req.setRequestHeader("Content-Type", "application/json")
    var postData = data ? JSON.stringify(data) : null;
    req.send(postData);
};

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
    GoBack() {
        hashHistory.goBack();
    }
}