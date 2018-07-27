import { observable, action, computed } from 'mobx'
import api from '../common/api'

class SealStore {
    @observable list = []

    @observable selected = null

    @action async getList(formId) {
        this.list = await api.category.list(formId)
    }

    @action getModel(id) {
        return this.list.find(e => e.ID === id);
    }
}

export default new SealStore()