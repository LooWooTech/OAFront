import React, { Component } from 'react'
import { Input, DatePicker } from 'antd'
import SelectUserModal from '../shared/_select_user'
import Modal from '../shared/_formmodal'
import moment from 'moment'
import api from '../../models/api'

class TodoModal extends Component {
    state = { toUser: {} }
    handleSubmit = (data) => {
        api.Task.SaveTodo(data, () => {
            this.props.onSubmit()
        })
    }
    handleSelect = (users) => {
        let user = users.length > 0 ? users[0] : null;
        this.setState({ toUser: user || {} });
    }
    render() {
        const model = this.props.model || {}
        function disabledDate(current) {
            return current && current.valueOf() < Date.now();
        }

        return (
            <Modal
                title={model.ID ? "修改子任务" : "添加子任务"}
                trigger={this.props.trigger}
                children={[
                    { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
                    { name: 'TaskId', defaultValue: model.TaskId || 0, render: <Input type="hidden" /> },
                    {
                        title: '内容', name: 'Content', defaultValue: model.Content,
                        render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />,
                        rules: [{ required: true, message: '请填写内容目标' }],
                    },
                    { name: 'ToUserId', defaultValue: this.state.toUser.ID || (model.ToUser ? model.ToUser.ID : 0), render: <Input type="hidden" /> },
                    {
                        title: '指派给',
                        before: <span>{this.state.toUser.RealName || model.ToUserName || '未指派'}  </span>,
                        render: <SelectUserModal
                            ref="selectUserForm"
                            onSubmit={this.handleSelect}
                        />
                    },
                    {
                        title: '计划完成时间', name: 'ScheduleTime',
                        defaultValue: model.ScheduleTime ? moment(model.ScheduleTime) : '',
                        render: <DatePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
                    },
                ]}
                onSubmit={this.handleSubmit}
            />
        )
    }
}

export default TodoModal