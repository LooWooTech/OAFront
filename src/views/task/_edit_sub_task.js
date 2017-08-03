import React, { Component } from 'react'
import { Input, Select, Radio, DatePicker } from 'antd'
import DepartmentSelect from '../shared/_department_select'
import Modal from '../shared/_formmodal'
import moment from 'moment'
import api from '../../models/api'

class SubTaskModal extends Component {
    state = { users: [], isMaster: true }


    handleSubmit = (data) => {
        api.Task.SaveSubTask(data, () => {
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
        var items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'TaskId', defaultValue: model.TaskId || 0, render: <Input type="hidden" /> },
            {
                title: '任务目标', name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />,
                rules: [{ required: true, message: '请填写任务目标' }],
            },
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
                title: '主办/协办', name: 'IsMaster', defaultValue: model.ParentId > 0 ? '0' : '1',
                render: <Radio.Group onChange={e => this.setState({ isMaster: e.target.value === '1' })} disabled={model.ID > 0}>
                    <Radio.Button value="1">主办</Radio.Button>
                    <Radio.Button value="0">协办</Radio.Button>
                </Radio.Group>
            }
        ];
        if (this.state.isMaster === undefined ? !model.isMaster : !this.state.isMaster) {
            items.push({
                title: '主办单位', name: 'ParentId', defaultValue: model.ParentId === undefined ? "" : model.ParentId.toString(),
                rules: [{ required: true, message: '请选择该协办科室所属的主办科室' }],
                render: <Select  disabled={model.ID > 0}>
                    {this.props.list.filter(e => e.ParentId === 0).map(item => <Select.Option key={item.ID}>{item.ToDepartmentName}[{item.ID}]</Select.Option>)}
                </Select>
            })
        }
        items.push({
            title: '选择责任人', name: 'ToUserId', defaultValue: model.ToUserId === undefined ? "" : model.ToUserId.toString(),
            rules: [{ required: true, message: '请选择责任人' }],
            render: <Select
                showSearch  disabled={model.ID > 0}
            >
                {users.map(user => <Select.Option key={user.ID}>{user.RealName}</Select.Option>)}
            </Select>
        });
        items.push({
            title: '计划完成时间', name: 'ScheduleDate',
            defaultValue: model.ScheduleDate ? moment(model.ScheduleDate) : '',
            render: <DatePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
        })
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