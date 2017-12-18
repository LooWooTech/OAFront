import { FORMS } from '../common/config'
class FormStore {
    getName(id) {
        let key = Object.keys(FORMS).find(key => FORMS[key].ID === id)
        var form = FORMS[key] || {};
        return form.Name || ''
    }

    getForm(formId) {
        let key = Object.keys(FORMS).find(key => FORMS[key].ID === formId)
        return FORMS[key]
    }

    getForms() {
        return Object.keys(FORMS).map(key => FORMS[key])
    }
}

export default new FormStore();