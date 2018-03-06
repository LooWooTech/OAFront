import { observable, action, computed } from 'mobx'
import api from '../common/api'

class SalaryStore {
    
    @observable salaryDatas = []

    @observable years = []

    @action async getYears(userId) {
        this.years = await api.salary.years(userId)
    }

    @action async getSalaryDatas(params) {
        const data = await api.salary.salaryDatas(params)
        this.salaryDatas = data.List
    }
}

export default new SalaryStore()