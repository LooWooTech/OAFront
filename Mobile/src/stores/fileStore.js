import { observable, computed, action } from 'mobx'
import api from '../common/api'
class FileStore {
    @observable list = []

    @action async getList(infoId) {
        const data = await api.file.list(infoId)
        this.list = data.List;
        return data
    }
}
const fileStore = new FileStore()
export default fileStore