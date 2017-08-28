import React, { Component } from 'react'
import { Input, Select, Checkbox, DatePicker } from 'antd'
import DepartmentSelect from '../shared/_department_select'
import Modal from '../shared/_formmodal'
import moment from 'moment'
import api from '../../models/api'

class SubTaskModal extends Component {
    state = { sms: true, users: [], isMaster: true }

    handleSubmit = (data) => {
        api.Task.SaveSubTask(data, (json) => {
            if (!data.ID && this.state.sms) {
                api.Sms.Send(data.ToUserId, json.TaskId)
            }
            this.props.onSubmit()
        });
    }

    handleSelectDepartment = (departmentId) => {
        api.User.List({ departmentId, rows: 999 }, json => {
            this.setState({ users: json.List })
        })
    }

    getItems = (model) => {
        let today = new Date();
        function disabledDate(current) {
            return current && current.valueOf() < today.valueOf();
        }
        let users = this.state.users || []
        if (model.ToUserId) {
            users.push({ ID: model.ToUserId, RealName: model.ToUserName })
        }
        let parentId = model.ParentId || 0;
        var items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'TaskId', defaultValue: model.TaskId || 0, render: <Input type="hidden" /> },
            { name: 'ParentId', defaultValue: parentId, render: <Input type="hidden" /> },
            {
                title: '任务目标', name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />,
                rules: [{ required: true, message: '请填写任务目标' }],
            },
            {
                title: '选择' + (parentId ? '协办' : '主办') + '科室', name: 'ToDepartmentId', defaultValue: model.ToDepartmentId === undefined ? "" : model.ToDepartmentId.toString(),
                rules: [{ required: true, message: '请选择科室' }],
                render: <DepartmentSelect
                    disabled={model.ID > 0}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    onSelect={this.handleSelectDepartment}
                    allowClear />
            },
            {
                title: '选择责任人', name: 'ToUserId', defaultValue: model.ToUserId === undefined ? "" : model.ToUserId.toString(),
                rules: [{ required: true, message: '请选择责任人' }],
                render: <Select
                    showSearch disabled={model.ID > 0}
                >
                    {users.map(user => <Select.Option key={user.ID}>{user.RealName}</Select.Option>)}
                </Select>,
                after: <div><Checkbox checked={this.state.sms} onChange={e => this.setState({ sms: e.target.checked })}>短信通知</Checkbox></div>
            },
            {
                title: '派单时间', name: 'CreateTime',
                defaultValue: moment(model.CreateTime),
                render: <DatePicker format="YYYY-MM-DD" />
            },
            {
                title: '计划完成时间', name: 'ScheduleDate',
                defaultValue: model.ScheduleDate ? moment(model.ScheduleDate) : null,
                render: <DatePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
            }
        ];
        return items;
    }

    render() {
        const model = this.props.model || {}
        return (
            <Modal
                title={model.ID ? "修改子任务" : "添加子任务"}
                trigger={this.props.trigger}
                children={this.getItems(model)}
                onSubmit={this.handleSubmit}
            />
        )
    }
}

export default SubTaskModal