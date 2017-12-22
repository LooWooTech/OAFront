import { observable, computed, action } from 'mobx'
import { FORMS } from '../common/config'
import api from '../common/api'
import FlatListData from './FlatListData'

class MissiveStore {

    @observable params = {
        formId: FORMS.Missive.ID,
        status: 0,
        searchKey: ''
    }

    @observable.ref data = new FlatListData((page, rows) => {
        return api.missive.list({ ...this.params, page, rows })
    })

    @computed get list() {
        return this.data.list
    }

    @action setParams(obj) {
        this.params = Object.assign(this.params, obj)
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
const missiveStore = new MissiveStore()
export default missiveStore