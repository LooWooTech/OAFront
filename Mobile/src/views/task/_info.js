import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Label } from 'native-base'
import Detail from '../shared/Detail'
import { FORMS } from '../../common/config'

class TaskDetail extends Component {

    getItems = () => {
        const data = this.props.data
        let items = [
            { name: 'ID', defaultValue: data.ID || 0, type: 'hidden' },
            { name: 'FormId', defaultValue: FORMS.Task.ID, type: 'hidden' },
            { name: 'Number', title: '任务单号', defaultValue: data.Number || '' },
            { name: 'Name', title: '任务事项', defaultValue: data.Name || '', },
            { name: 'From', title: '任务来源', defaultValue: (data.FromType) + ' ' + data.From || '' },
            { name: 'Goal', title: '任务目标', defaultValue: data.Goal || '', type: 'textarea' },
            { name: 'ScheduleDate', title: '计划完成时间', defaultValue: data.ScheduleDate, type: 'date' }
        ];
        return items;
    }

    render() {
        const data = this.props.data
        if (!data) return null
        return (
            <Detail items={this.getItems()}/>
        );
    }
}
TaskDetail.propTypes = {
    data: PropTypes.object.isRequired,
};

export default TaskDetail;