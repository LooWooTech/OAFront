import React, { Component } from 'react'
import { Input } from 'antd'
import Modal from '../shared/_formmodal'
import api from '../../models/api'

class EditProgressModal extends Component {
    handleSubmit = (data) => {
        api.Task.SaveProgress(data, () => {
            this.props.onSubmit()
        })
    }
    render() {
        const model = this.props.model || {}
        return (
            <Modal
                title={model.ID ? "修改任务进展" : "添加任务进展"}
                trigger={this.props.trigger}
                children={[
                    { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
                    { name: 'TaskId', defaultValue: model.TaskId || 0, render: <Input type="hidden" /> },
                    {
                        title: '内容', name: 'Content', defaultValue: model.Content,
                        render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />,
                        rules: [{ required: true, message: '请填写进展内容' }],
                    }
                ]}
                onSubmit={this.handleSubmit}
            />
        )
    }
}

export default EditProgressModal