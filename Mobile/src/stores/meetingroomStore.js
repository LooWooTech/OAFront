import { observable, action, computed } from 'mobx'
import api from '../common/api'

class MeetingRoomStore {
    @observable list = []

    @action async getList() {
        
    }

}

export default new MeetingRoomStore()