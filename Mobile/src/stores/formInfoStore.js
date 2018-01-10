import { observable, action, computed } from 'mobx'
import api from '../common/api'

class FormInfoStore {

    @observable data = null

    @action async loadData(id) {
        let data = await api.formInfo.model(id)
        if (data.flowNodeData) {
            data.flowNodeData = data.model.FlowData.Nodes.find(n => n.$id === data.flowNodeData.$ref);
        }

        if (data.freeFlowNodeData) {
            data.freeFlowNodeData = data.flowNodeData.FreeFlowData.Nodes.find(n => n.$id === data.freeFlowNodeData.$ref);
        }
        this.data = data
        return data
    }

    @action async submitFlow(data) {
        await api.flowData.submit(data)
        await this.loadData(data.InfoId)
    }
    @action async cancelFlow(infoId) {
        await api.flowData.cancel(infoId)
        await this.loadData(infoId)
    }

    @action async flagRead(freeFlowNodeDataId, infoId, flowNodeDataId) {
        await api.freeflowData.submit(infoId, flowNodeDataId, null, null, { ID: freeFlowNodeDataId })
        await this.loadData(infoId)
    }

    @action async submitFreeFlow(infoId, flowNodeDataId, toUserIds, ccUserIds, formData) {
        await api.freeflowData.submit(infoId, flowNodeDataId, toUserIds, ccUserIds, formData)
        await this.loadData(infoId)
    }

    @action async completeFreeFlow(infoId, freeflowDataId) {
        await api.freeflowData.complete(freeflowDataId, infoId)
        await this.loadData(infoId)
    }
    async sendSms(userIds, infoId) {
        await api.sms.send(userIds, infoId);
    }
}
const formInfoStore = new FormInfoStore()
export default formInfoStore