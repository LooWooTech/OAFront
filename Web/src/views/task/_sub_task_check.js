import React, { Component } from 'react'
import { Input, Radio } from 'antd'
import Modal from '../shared/_formmodal'
import api from '../../models/api'

class SubTaskCheckModal extends Component {
    state = {}
    handleSubmit = data => {
        data.Result = data.Result === "1";
        api.Task.CheckSubTask(data, json => {
            this.props.onSubmit(json)
        })
    }

    getItems = (model) => {
        let parent = this.props.parent;
        var items = [
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            { title: '提交意见', render: parent.Content },
            { title: '意见', name: 'Content', render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} /> },
            {
                title: '结果', name: 'Result', defaultValue: "1",
                render: <Radio.Group>
                    <Radio.Button value="1">完成</Radio.Button>
                    <Radio.Button value="0">未完成</Radio.Button>
                </Radio.Group>
            }
        ]

        return items;
    }
    render() {
        const model = this.props.model
        if (!model) return null

        return (
            <Modal
                title="审核任务"
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger}
                children={this.getItems(model)}
            />
        )
    }
}

export default SubTaskCheckModal