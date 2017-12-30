import { observable, action, computed } from 'mobx'
import api from '../common/api'
class FreeFlowStore {

    @action async submit(id, infoId, flowNodeDataId, toUserIds, ccUserIds) {
        return await api.freeflowData.submit(id, infoId, flowNodeDataId, toUserIds, ccUserIds)
    }

    @action async complete(freeflowDataId, infoId) {
        return await api.freeflowData.complete(freeflowDataId, infoId)
    }
}

const freeflowStore = new FreeFlowStore();
export default freeflowStore