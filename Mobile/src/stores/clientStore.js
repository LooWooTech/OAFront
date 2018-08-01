import { observable, action, computed } from 'mobx'
import { VERSION } from '../common/config'
import api from '../common/api'

class ClientStore {

    @observable currentVersion;
    @observable lastVersion;

    constructor() {
        this.currentVersion = VERSION;
        api.client.lastVersion().then(val => {
            this.lastVersion = val
        })
    }

    @computed get shouldUpgrade() {
        const newVersion = [this.currentVersion, this.lastVersion].sort()[1]
        return newVersion != this.currentVersion;
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