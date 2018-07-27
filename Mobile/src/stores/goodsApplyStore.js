import { observable, computed, action } from 'mobx'
import api from '../common/api'
import FlatListData from './FlatListData'

class GoodsApplyStore extends FlatListData {
    constructor() {
        super((page, rows) => {
            return api.goods.applyList({ ...this.params, page, rows })
        })
    }
    //列表页参数
    @observable params = {
        status: 0,
        searchKey: '',
        approvalUserId: 0,
        applyUserId: 0,
        goodsId: 0,
    }

    @action setParams(obj) {
        this.params = Object.assign(this.params, obj)
    }
}
export default new GoodsApplyStore()