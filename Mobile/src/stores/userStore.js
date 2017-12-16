import { observable, action, computed } from 'mobx'
import { AsyncStorage } from 'react-native'
import api from '../common/api'

const userKey = 'user'
class UserStore {
    @observable inProgress = false
    @observable user = null

    async login(username, password) {
        this.inProgress = true
        let user = await api.User.Login(username, password)
        if (user && user.ID) {
            console.debug("user", user)
            this.user = user
            await AsyncStorage.setItem(userKey, JSON.stringify(user))
        }
        this.inProgress = false
    }

    async logout() {
        await AsyncStorage.removeItem(userKey)
        user = null;
    }

    async getUser() {
        if (!this.user) {
            let data = await AsyncStorage.getItem(userKey)
            console.log(data)
            this.user = JSON.parse(data)
        }
        return this.user;
    }

    hasLogin() {
        return this.getUser().ID > 0
    }

    getToken() {
        return this.getUser().Token;
    }

    isCurrentUser(userId) {
        return this.getUser().ID === userId
    }
}
const userStore = new UserStore()
export default userStore