import { observable, action, computed } from 'mobx'
import api from '../common/api'

class MailStore {
    @observable list = []

    @action async getList() {
        
    }

}

export default new MailStore()