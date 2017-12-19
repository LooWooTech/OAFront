import { observable, computed, action } from 'mobx'
import userStore from './userStore'
import api from '../common/api'

class MessageStore {
    @observable loading = false
    //消息列表
    @observable list = []
    @observable finished = false
    @observable hasRead = false
    @observable page = 1
    rows = 10

    @action async read(id) {
        for (var i = 0; i < list.length; i++) {
            let item = list[i]
            if (item.ID === id) {
                list.splice(i, 1)
            }
        }
        await api.message.read(id)
    }

    @action async readAll() {
        this.list = []
        await api.message.readAll()
    }

    @action refreshData() {
        this.list = []
        this.finished = false
        this.loadData(1)
    }

    @action setStatus(hasRead) {
        this.hasRead = hasRead
    }

    @action async loadData(page) {
        this.loading = true;
        const shouldLoad = !this.finished && ((page === 1 && this.list.length === 0) || page !== this.page)
        if (shouldLoad) {
            const data = await api.message.list(this.hasRead, page, this.rows)
            if (data.Page.pageCount <= this.page) {
                this.finished = true;
            }
            this.page = data.Page.current
            this.list = this.list.concat(data.List)
        }
        this.loading = false;
        return this.list
    }
}
const messageStore = new MessageStore()
export default messageStore