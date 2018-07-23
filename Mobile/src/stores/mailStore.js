import { observable, computed, action } from 'mobx'
import api from '../common/api'
import FlatListData from './FlatListData'

class MailStore extends FlatListData {

    constructor() {
        super((page, rows) => {
            return api.mail.list({ ...this.params, page, rows })
        })
    }

    //列表页
    @observable params = { searchKey: '' }

    @action setParams(obj) {
        this.params = Object.assign(this.params, obj)
    }

    //详细页
    @observable data = null
    @action async getDetailData(id) {
        if (!id) return null
        let data = await api.mail.model(id)
        this.data = data;
        return this.data
    }

    @action async delete(id) {
        await api.mail.delete(id)
    }

    @action async send(data) {
        await api.mail.send(data)
    }
    @action    async save(data) {
        await api.mail.save(data)
    }
}
export default new MailStore()