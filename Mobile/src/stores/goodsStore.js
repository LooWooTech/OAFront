import { observable, computed, action } from 'mobx'
import api from '../common/api'
import FlatListData from './FlatListData'

class GoodsStore extends FlatListData {
    constructor() {
        super((page, rows) => {
            return api.goods.list({ ...this.params, page, rows })
        })
    }
    //列表页参数
    @observable params = {
        status: 0,
        categoryId: 0,
        searchKey: ''
    }
    @action setParams(obj) {
        this.params = Object.assign(this.params, obj)
    }

    @action async apply(formData) {
        await api.goods.apply(formData)
    }

    @action async approval(formData){
        await api.goods.approval(formData)
    }
}
export default new GoodsStore()