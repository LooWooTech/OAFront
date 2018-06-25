import React, { Component } from 'react'
import { Input,  DatePicker } from 'antd'
import Modal from '../shared/_formmodal'
import moment from 'moment'
import api from '../../models/api'

class EditSubTaskModal extends Component {
    handleSubmit = (data) => {
        data.UpdateTime = data.UpdateTime.format();
        data.ScheduleDate = data.ScheduleDate.format();
        api.Task.SaveSubTask(data, (json) => {
            this.props.onSubmit()
        });
    }

    getItems = (model) => {
        var items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            {
                title: '任务目标', name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />,
                rules: [{ required: true, message: '请填写任务目标' }],
            },
            {
                title: '派单时间', name: 'UpdateTime',
                defaultValue: moment(model.UpdateTime || model.CreateTime),
                render: <DatePicker format="YYYY-MM-DD" />
            },
            {
                title: '计划完成时间', name: 'ScheduleDate',
                defaultValue: model.ScheduleDate ? moment(model.ScheduleDate) : null,
                render: <DatePicker format="YYYY-MM-DD" />
            },
        ];
        return items;
    }

    render() {
        const model = this.props.model || {}
        return (
            <Modal
                title={"修改任务"}
                trigger={this.props.trigger}
                children={this.getItems(model)}
                onSubmit={this.handleSubmit}
            />
        )
    }
}

export default EditSubTaskModal