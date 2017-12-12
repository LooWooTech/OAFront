import React, { Component } from 'react'
import { Input } from 'antd'
import Modal from '../shared/_formmodal'
import api from '../../models/api'

class SubTaskSubmitModal extends Component {
    state = {}
    handleSubmit = data => {
        api.Task.SubmitSubTask(data, json => {
            this.props.onSubmit(json)
        })
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