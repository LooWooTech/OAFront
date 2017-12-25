import { observable, action, computed } from 'mobx'
import api from '../common/api'

class FormInfoStore {

    @observable model = null

    @action async getModel(id) {
        let data = await api.formInfo.model(id)
        if (data.flowNodeData) {
            data.flowNodeData = data.model.FlowData.Nodes.find(n => n.$id === data.flowNodeData.$ref);
        }

        if (data.freeFlowNodeData) {
            data.freeFlowNodeData = data.flowNodeData.FreeFlowData.Nodes.find(n => n.$id === data.freeFlowNodeData.$ref);
        }
        this.model = data
        return data
    }
}
const formInfoStore = new FormInfoStore()
export default formInfoStore