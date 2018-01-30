import mobx, { observable, action, computed } from 'mobx'
import api from '../common/api'
import moment from 'moment'
import FlatListData from './FlatListData'
import { FORMS } from '../common/config'

class FormExtend1Store extends FlatListData {

    @observable params = {
        formId: FORMS.Attendance.ID,
        status: 0,
        infoId: 0,
        approvalUserId: 0,
        userId: 0
    }

    constructor() {
        super((page, rows) => {
            return api.formExtend1.list({ ...this.params, page, rows })
        })
    }

    @action setParams(obj) {
        this.params = Object.assign(this.params, obj)
    }

    @observable model = null

    @action checkModel(model) {
        this.model = model
    }

    @action async back(id, time) {
        if (this.model) {
            this.model.RealEndTime = time || moment().format('lll')
        }
        await api.formExtend1.back(id, time)
    }
}


const formExtend1Store = new FormExtend1Store()
export default formExtend1Store