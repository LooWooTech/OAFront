import { observable, action, computed } from 'mobx'
import DeviceInfo from 'react-native-device-info'
import api from '../common/api'
import moment from 'moment'

const outColor = { color: '#ccc', selectedColor: '#eee' }
const workColor = { color: '#00a854', selectedColor: '#9ce4c0', textColor: '#00a854' }
const leaveColor = { color: 'red', selectedColor: 'yellow' }

class AttendanceStore {
    @observable selectedDay = new Date()
    @observable data = {}
    @observable month = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    @computed get currentLogs() {
        const date = moment(this.selectedDay)
        return (this.data.logs || []).filter(e => moment(e.CreateTime).format('YYYYMMDD') === date.format('YYYYMMDD'))
    }
    @computed get currentLeaves() {
        const date = moment(this.selectedDay)
        return (this.data.leaves || []).filter(e => moment(e.ScheduleBeginTime) <= date && moment(e.ScheduleEndTime) >= date)
    }
    @computed get markedDates() {
        let result = {}
        const month = this.month
        let date = moment(new Date(month.getFullYear(), month.getMonth(), 1));
        while (date.month() === month.getMonth()) {
            const model = (this.data.list || []).find(e => moment(e.Date).format('YYYYMMDD') == date.format('YYYYMMDD'))
            const holiday = (this.data.holiday || []).find(e => moment(e.BeginDate) <= date && date <= moment(e.EndDate))
            const leave = (this.data.leaves || []).find(e => moment(e.ScheduleBeginTime) <= date && date <= moment(e.ScheduleEndTime))
            const dots = []
            if (!model) {
                if (!holiday) {
                    if (date < moment()) {
                        dots.push({ key: 'workout', ...outColor })
                    }
                }
                else if (leave && leave.Result) {
                    dots.push({ key: 'leave', ...leaveColor })
                }
            }
            else {
                dots.push(this.getAttendanceDot(model.AMResult, 'am'))
                dots.push(this.getAttendanceDot(model.PMResult, 'pm'))
            }
            const selected = moment(this.selectedDay).format('YYYYMMDD') === date.format('YYYYMMDD')
            result[moment(date).format('YYYY-MM-DD')] = { selected, dots, disabled: date > moment() }
            date = date.add(1, 'days')
        }
        return result;
    }

    getAttendanceDot(result, key) {
        switch (result) {
            case 1:
                return { key: key, ...outColor };
            case 2:
            case 3:
                return { key: key, ...workColor }
            case 4:
                return { key: key, ...leaveColor }
            default:
                return { key: key, ...workColor };
        }
    }

    @action selectDate(date) {
        this.selectedDay = date
    }
    @action async loadData(year, month) {
        this.data = await api.attendance.month(year, month)
        this.month = new Date(year, month - 1, 1)
    }
}

export default new AttendanceStore()