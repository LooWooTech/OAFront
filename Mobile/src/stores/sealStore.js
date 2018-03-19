import { observable, action, computed } from 'mobx'
import api from '../common/api'

class SealStore {
    @observable list = []

    @action async getList() {
        
    }

}

export default new SealStore()