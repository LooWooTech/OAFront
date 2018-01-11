import { API_HOST } from '../common/config'
import { NavigationActions } from 'react-navigation'
import { Toast } from 'antd-mobile'
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
        return '';
    return Object
        .keys(json)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent((json[key] === null || json[key] === undefined) ? '' : json[key]))
        .join('&');
}

function throwException(ex) {
    console.debug("error", ex)
    const msg = ex.ExceptionMessage || ex.Message || ex.ReferenceError || '未知错误'
    Toast.fail(msg, 1)
}

async function request(path, query, data, httpMethod) {
    let url = API_HOST + path
    if (query) {
        if (url.indexOf('?') > -1) {
            url += jsonToQueryString(query)
        } else {
            url += '?' + jsonToQueryString(query)
        }
    }
    let options = {
        'method': httpMethod,
        'headers': {
            'token': userStore.token || '',
            'Content-Type': 'application/json'
        }
    }
    try {
        let result = undefined;
        switch (httpMethod) {
            case 'GET':
            case 'DELETE':
                result = await fetch(url, options)
                break;
            case 'POST':
                options.body = JSON.stringify(data)
                result = await fetch(url, options)
                break;
        }
        console.debug(url)
        console.debug('result._bodyText', result._bodyText)
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
    get(path, query) {
        return request(path, query, null, 'GET');
    },
    post(path, query, data) {
        return request(path, query, data, 'POST');
    },
    delete(path, query) {
        return request(path, query, null, 'DELETE');
    },
    reload(navigation, viewName, params) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: viewName, params: params })
            ]
        })
        navigation.dispatch(resetAction);
    },
}
