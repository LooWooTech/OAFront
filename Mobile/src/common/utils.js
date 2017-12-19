import { Toast } from 'antd-mobile'
import { API_HOST } from '../common/config'
import userStore from '../stores/userStore'
function queryStringToJson(str) {
    let json = {}
    str.split('&').map(kv => {
        let arr = kv.split('=')
        if (arr.length === 2) {
            json[arr[0]] = decodeURIComponent(arr[1])
        }
        return json
    })
    return json;
}
function jsonToQueryString(json) {
    if (!json)
        return null;
    return Object
        .keys(json)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
        .join('&');
}

function throwException(ex) {
    console.debug("error", ex)
    let msg = ex.Message || ex.ReferenceError || '未知错误'
    Toast.fail(msg, 1)
}

async function request(path, data, httpMethod) {
    let url = API_HOST + path
    let options = {
        'method': httpMethod,
        'headers': {
            'token': userStore.token || '',
            'Content-Type': 'application/json',
        }
    }
    try {
        let result = undefined;
        switch (httpMethod) {
            case 'GET':
            case 'DELETE':
                url += '?' + jsonToQueryString(data)
                result = await fetch(url, options)
                break;
            case 'POST':
                result = await fetch(url, options, data)
                break;
        }
        console.log('result._bodyText', result._bodyText)
        switch (result.status) {
            case 200:
            case 204:
                if (result._bodyText)
                    return JSON.parse(result._bodyText)
                break;
            default:
                throwException(JSON.parse(result._bodyText))
                break;
        }
    } catch (err) {
        throwException(err)
    }
}

module.exports = {
    get(path, parameters) {
        return request(path, parameters, 'GET');
    },
    post(path, data) {
        return request(path, data, 'POST');
    },
    delete(path, parameters) {
        return request(path, parameters, 'DELETE');
    }
}
