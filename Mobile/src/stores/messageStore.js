import { observable, computed, action } from 'mobx'
import userStore from './userStore'
import api from '../common/api'

class MessageStore {
    @observable loading = false
    //最新消息
    @observable unreads = []
    //消息列表
    @observable list = []

    @action async getUnreads(top) {
        this.loading = true;
        this.unreads = await api.message.unreads(top) || []
        this.loading = false;
        return this.unreads;
    }

    @action async read(id) {
        for (var i = 0; i < unreads.length; i++) {
            let item = unreads[i]
            if (item.ID === id) {
                unreads.splice(i, 1)
            }
        }
        await api.message.read(id)
    }

    @action async readAll() {
        this.unreads = []
        await api.message.readAll()
    }

    @action async getMessages(parameters) {
        this.loading = true;
        this.list = await api.message.list(parameters);
        this.loading = false;
        return this.list
    }
}
const messageStore = new MessageStore()
export default messageStore