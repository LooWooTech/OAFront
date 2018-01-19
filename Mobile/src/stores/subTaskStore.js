import { observable, action, computed } from 'mobx'
import api from '../common/api'

class SubTaskStore {
    @observable list = []
    @observable data = {}

    @action async loadData(taskId) {
        

        const list = await api.task.subTaskList(taskId)
        this.list = list
        const flowData = await api.flowData.model()
    }
}

export default new SubTaskStore()