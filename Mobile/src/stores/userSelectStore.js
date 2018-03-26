import { observable, action, computed, extendObservable } from 'mobx'
import api from '../common/api'
class UserSelectData {
    @observable users = []
    @observable departments = []
    @observable params = {}
    @observable hasChanged = false
    @action setParams(params) {
        Object.keys(params).map(key => {
            if (!this.params[key]) {
                this.params[key] = params[key]
                this.hasChanged = true
            }
            else if (this.params[key] != params[key]) {
                if (typeof (params[key]) === 'string' || typeof (params[key]) === 'number') {
                    this.params[key] = params[key]
                    this.hasChanged = true
                }
            }
        })
    }
    @action async loadData() {
        //判断params 是否变化，如果没变化，则不加载
        if (!this.hasChanged) return this.users;
        this.hasChanged = false
        const formType = this.params.formType
        switch (formType) {
            case 'flow':
                this.users = await this._loadUsersForFlowData()
                break;
            case 'freeflow':
                this.users = await this._loadUsersForFreeflowData()
                break;
            default:
                this.users = await this._loadAllUsers()
                break;
        }
        this._filterUsers()
        return this.users
    }

    async _loadUsersForFlowData() {
        const { flowNodeId, flowDataId, flowId, flowStep } = this.params;
        return await api.flowData.users(flowId, flowNodeId, flowDataId, flowStep || 1)
    }
    async _loadUsersForFreeflowData() {
        const flowNodeDataId = this.params.flowNodeDataId;
        return await api.freeflowData.users(flowNodeDataId)
    }
    async _loadAllUsers() {
        const data = await api.user.list({ page: 1, rows: 10000 })
        return data.List;
    }

    _filterUsers() {
        this.users = this.users.sort((a, b) => b.Sort - a.Sort)

        this.users.map(user => extendObservable(user, { selected: (this.params.users || []).find(e => e.ID == user.ID) }))
        const searchKey = this.params.searchKey || ''
        if (searchKey) {
            this.users = this.users.filter(e => e.RealName.indexOf(searchKey) > -1 || e.Username.indexOf(searchKey) > -1)
        }
        this._initDepartments()
    }
    _initDepartments() {
        let departments = []
        this.users.map(user => user.Departments.map(d => {
            if (!departments.find(e => e.ID === d.ID)) {
                departments.push(d)
            }
            extendObservable(d, { selected: false })
            return d
        }))
        this.departments = departments.sort((a, b) => a.Sort - b.Sort);
    }
    @computed get multiple() {
        return this.params.multiple || this.params.formType === 'freeflow'
    }
    @action setUserSelected(id, selected = true) {
        if (selected && !this.multiple) {
            this.users.map(user => user.selected = false)
        }
        const user = this.users.find(e => e.ID === id)
        user.selected = selected
    }
    @action setDepartmentSelected(id, selected = true) {
        const department = this.departments.find(e => e.ID === id)
        department.selected = selected
        if (this.multiple) {
            this.users.filter(e => e.Departments.find(d => d.ID === id)).map(user => {
                user.selected = selected
            })
        }
    }
    @action setAllUserSelected(selected) {
        this.users.map(user => user.selected = selected)
        this.departments.map(d => d.selected = selected)
    }

    @action clear() {
        this.users.map(e => e.selected === undefined)
        this.departments.map(d => d.selected === undefined)
    }

    @action reset() {
        this.users = []
        this.departments = []
        this.params = {}
    }
}

class UserSelectStore {
    @observable datas = {}
    @observable key = "default"
    @computed get data() {
        if (!this.datas[this.key]) {
            this.datas[this.key] = new UserSelectData()
        }
        return this.datas[this.key]
    }
    @action setParams(params) {
        if (params.key) {
            this.key = params.key
        }
        this.data.setParams(params)
    }
}
export default new UserSelectStore()