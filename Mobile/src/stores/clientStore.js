import { observable, action, computed } from 'mobx'
import DeviceInfo from 'react-native-device-info'
import api from '../common/api'

class ClientStore {

    @observable currentVersion;
    @observable lastVersion;

    constructor() {
        this.currentVersion = DeviceInfo.getVersion()
        api.client.lastVersion().then(val => {
            this.lastVersion = val
        })
    }

    @computed get shouldUpgrade() {
        return  parseFloat(this.lastVersion) > parseFloat(this.currentVersion)
    }

    async checkVersion() {
        this.lastVersion = await api.client.lastVersion()
        return this.lastVersion
    }

    getDownloadUrl() {
        return api.client.downloadUrl()
    }
}

export default new ClientStore()