import React, { Component } from 'react'
import { Select, Checkbox } from 'antd'
import Modal from '../shared/_formmodal'
import DepartmentSelect from '../shared/_department_select'

export default class TaskUserSelect extends Component {

    state = { users: [], sms: true, }

    handleSubmit = (data) => {
        console.log(data)
    }

    getItems = () => {
        const model = this.props.model || {}
        let users = this.state.users || []

        if (model.ToUserId) {
            users.push({ ID: model.ToUserId, RealName: model.ToUserName })
        }

        let items = [
            {
                title: '选择科室', name: 'ToDepartmentId', defaultValue: model.ToDepartmentId === undefined ? "" : model.ToDepartmentId.toString(),
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
                render: <Select showSearch disabled={model.ID > 0} >
                    {users.map(user => <Select.Option key={user.ID}>{user.RealName}</Select.Option>)}
                </Select>,
                after: <div><Checkbox checked={this.state.sms} onChange={e => this.setState({ sms: e.target.checked })}>短信通知</Checkbox></div>
            }];

        return items;
    }

    render() {
        return (
            <Modal
                title="选择科室和负责人"
                trigger={this.props.trigger}
                children={this.getItems()}
                onSubmit={this.handleSubmit}
            />
        )
    }
}
