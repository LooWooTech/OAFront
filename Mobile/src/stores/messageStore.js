import mobx, { isObservable, observable, computed, action } from 'mobx'
import userStore from './userStore'
import api from '../common/api'
import FlatListData from './FlatListData'

class MessageStore {
    @observable hasRead = false

    @observable.ref data = new FlatListData((page, rows) => {
        return api.message.list(this.hasRead, page, rows)
    })

    @computed get list() {
        return this.data.list
    }

    @action async read(id) {
        const i = this.data.list.findIndex(e => e.ID === id);
        this.data.list.splice(i, 1)
        await api.message.read(id)
    }

    @action async readAll() {
        this.data.list = []
        await api.message.readAll()
    }

    @action setStatus(hasRead) {
        this.hasRead = hasRead
    }

    @action refreshData() {
        this.data.refreshData()
    }

    @action loadData(page) {
        return this.data.loadData(page)
    }

    @action loadNextPageData() {
        return this.data.loadData(this.data.page + 1)
    }
}
const messageStore = new MessageStore()
export default messageStore