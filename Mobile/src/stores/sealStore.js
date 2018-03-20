import { observable, action, computed } from 'mobx'
import api from '../common/api'

class SealStore {
    @observable list = []

    @action async getList() {
        this.list = await api.seal.list()
    }

    @action async apply(data) {
        await api.seal.apply(data)
    }
}

export default new SealStore()