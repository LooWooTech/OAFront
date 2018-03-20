import { observable, action, computed } from 'mobx'
import api from '../common/api'

class MeetingRoomStore {
    @observable list = []

    @action async getList() {
        this.list = await api.meetingroom.list();
        return this.list;
    }

    @action async apply(data) {
        await api.meetingroom.apply(data)
    }
}

export default new MeetingRoomStore()