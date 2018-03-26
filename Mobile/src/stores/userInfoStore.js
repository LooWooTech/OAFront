import { observable, computed, action } from 'mobx'
import api from '../common/api'

class UserInfoStore {
    @action async star(id) {
        return api.userInfo.star(id)
    }

    @action async unStar(id) {
        return api.userInfo.unStar(id)
    }

    @action async trash(id) {
        return api.userInfo.trash(id)
    }

    @action async delete(id) {
        return api.userInfo.delete(id)
    }

    @action async recovery(id) {
        return api.userInfo.recovery(id)
    }

}

export default new UserInfoStore()