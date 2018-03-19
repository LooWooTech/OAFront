import { observable, action, computed } from 'mobx'
import api from '../common/api'

class CarStore {

    @observable list = []

    @action async getList() {
        this.list = await api.car.list();
        return this.list;
    }

    @action async apply(data) {
        await api.car.apply(data)
    }
}
const carStore = new CarStore()
export default carStore