import { observable, computed, action } from 'mobx'
import { FORMS } from '../common/config'
import api from '../common/api'
import FlatListData from './FlatListData'

class MissiveStore extends FlatListData {

    constructor(){
        super((page, rows) => {
            return api.missive.list({ ...this.params, page, rows })
        })
    }

    //列表页
    @observable params = {
        formId: FORMS.Missive.ID,
        status: 0,
        searchKey: ''
    }

    @action setParams(obj) {
        this.params = Object.assign(this.params, obj)
    }

    //详细页
    @observable model = null
    @action async getModel(id) {
        const data = await api.missive.model(id)
        this.model = data
        return data
    }
}
const missiveStore = new MissiveStore()
export default missiveStore