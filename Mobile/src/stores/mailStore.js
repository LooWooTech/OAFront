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
        const data = await api.mail.model(id)
        this.data = data
        return data
    }

    @action async delete(id) {
        await api.mail.delete(id)
    }

    @action async star(id, isStar) {
        await api.mail.star(id, isStar)
    }
}
export default new MailStore()