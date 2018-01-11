import { observable, computed, action } from 'mobx'
import api from '../common/api'
import utils from '../common/utils'
import userStore from '../stores/userStore'

class FileStore {
    @observable list = []

    @action async getList(infoId) {
        const data = await api.file.list(infoId)
        this.list = data.List;
        return data
    }

    getSource(fileId) {
        const fileUrl = api.file.getUrl(fileId)
        return {
            uri: fileUrl,
            method: 'GET',
            headers: {
                'token': userStore.token || '',
                'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0 Safari/537.36 OAMobile/1.0',
            }
        }
    }
}
const fileStore = new FileStore()
export default fileStore