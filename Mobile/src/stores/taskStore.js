import { observable, computed, action } from 'mobx'
import api from '../common/api'
import FlatListData from './FlatListData'
import formInfoStore from './formInfoStore'

class TaskStore extends FlatListData {
    constructor() {
        super((page, rows) => {
            return api.task.list({ ...this.params, page, rows })
        })
    }
    //列表页参数
    @observable params = {
        status: 0,
        searchKey: ''
    }
    @action setParams(obj) {
        this.params = Object.assign(this.params, obj)
    }
    //详细页task实体
    @observable model = null

    @action async getModel(id) {
        const model = await api.task.model(id)
        this.model = model
        return model
    }

    @observable flowData = {}
    @observable subTasks = []
    @action async getSubTaskList() {
        const list = await api.task.subTaskList(this.model.ID)
        this.subTasks = list
    }

    @computed get masterTasks() {
        return this.subTasks.filter(e => e.ParentId === 0)
            .map(node => this.getTreeNode(node))
    }

    getTreeNode(node) {
        node.children = this.subTasks.filter(e => e.ParentId === node.ID);
        node.children.map(child => {
            child.Parent = node;
            this.getTreeNode(child, this.subTasks);
            return child;
        })
        return node
    }

    @action async submitSubTask(subTaskId, content) {
        await api.task.submitSubTask(subTaskId, content);
        await this.getSubTaskList()
        await formInfoStore.loadData(this.model.ID)
    }

    @action async checkSubTask(subTaskId, result, content) {
        await api.task.checkSubTask(subTaskId, result, content)
        await this.getSubTaskList()
        await formInfoStore.loadData(this.model.ID)
    }

    @action async updateTodoStatus(todoId){
        await api.task.updateTodoStatus(todoId)
        await this.getSubTaskList()
        await formInfoStore.loadData(this.model.ID)
    }
}
export default new TaskStore()