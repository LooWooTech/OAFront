import { observable, action, computed } from 'mobx'
import { AsyncStorage } from 'react-native'
import api from '../common/api'
import { USER_ROLE } from '../common/config'
const userKey = 'user'
class UserStore {
    @observable inProgress = false
    @observable user = null

    constructor() {
        AsyncStorage.getItem(userKey, (err, json) => {
            if (json) {
                const data = JSON.parse(json)
                if (data && data.ID) {
                    this.user = data
                }
            }
        });
    }

    @computed get isManager() {
        return this.user.Role === USER_ROLE.Manager
    }

    hasRight(rightName) {
        console.log(this.user)
        return true;
        //return this.user != null && this.user.
    }

    @computed get hasLogin() {
        return this.user != null && this.user.ID > 0
    }

    @computed get token() {
        return this.user ? this.user.Token : null;
    }

    @action async login(username, password) {
        this.inProgress = true
        const data = await api.user.login(username, password)
        if (data && data.ID) {
            this.user = data
            await AsyncStorage.setItem(userKey, JSON.stringify(data))
        }
        this.inProgress = false
    }

    @action async logout() {
        this.user = null;
        await AsyncStorage.removeItem(userKey)
    }

    isCurrentUser(userId) {
        return this.user && this.user.ID === userId;
    }

    @observable leaders = []
    @action async getLeaders(userId = 0) {
        const list = await api.user.leaders(userId)
        this.leaders = list
    }
}
const userStore = new UserStore()
export default userStore