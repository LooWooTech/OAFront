import mobx, { isObservable, observable, computed, action } from 'mobx'
import userStore from './userStore'
import api from '../common/api'
import FlatListData from './FlatListData'

class MessageStore extends FlatListData {
    @observable hasRead = false
    constructor() {
        super((page, rows) => {
            return api.message.list(this.hasRead, page, rows)
        })
    }

    @action async read(id) {
        const i = super.list.findIndex(e => e.ID === id);
        super.list.splice(i, 1)
        await api.message.read(id)
    }

    @action async readAll() {
        super.list = []
        await api.message.readAll()
    }

    @action setStatus(hasRead) {
        this.hasRead = hasRead
    }
}
const messageStore = new MessageStore()
export default messageStore