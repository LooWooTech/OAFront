import React, { Component } from 'react'
import { Input, message } from 'antd'
import Modal from '../shared/_formmodal'
import UserSelect from '../shared/_user_select'
import api from '../../models/api'

class SubTaskSubmitModal extends Component {
    state = {}
    handleSubmit = data => {
        data.ToUserId = this.state.toUser ? this.state.toUser.ID : 0;
        api.Task.SubmitSubTask(data, json => {
            this.props.onSubmit(json)
        })
    }
    handleSelectUser = (users) => {
        if (users.length === 0) {
            message.error('请选择分管领导');
            return false;
        }
        this.setState({ toUser: users[0] })
    }

    getItems = (model) => {
        var items = [
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            {
                title: '说明', name: 'Content',
                rules: [{ required: true, message: '请填写任务完成说明' }],
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            }
        ]
        if (model.IsMaster) {
            items.push({
                title: '选择分管领导',
                rules: [{ required: true, message: '请选择分管领导' }],
                render: <UserSelect onSubmit={this.handleSelectUser} />,
                before: this.state.toUser ? this.state.toUser.RealName : '未选择'
            })
        }
        return items;
    }
    render() {
        const model = this.props.model
        if (!model) return null

        return (
            <Modal
                title="提交任务"
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger}
                children={this.getItems(model)}
            />
        )
    }
}

export default SubTaskSubmitModal