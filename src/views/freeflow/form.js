import React, { Component } from 'react'
import { Input, message } from 'antd'
import SelectUser from '../shared/_select_user'
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class FreeFlowForm extends Component {
    state = {}

    handleSubmit = (data) => {
        var toUserIds = this.refs.selectUserForm.getSelectedUsers().map(e => e.ID).join()
        api.FreeFlowData.Submit(data.FlowNodeDataID, data.InfoId, toUserIds, data, json => {
            message.success("提交成功")
            const callback = this.props.callback
            if (callback) {
                callback(json)
            }
        })
    }

    getFormItems = (flowNodeData) => {
        const model = this.props.record || {}
        var items = [
            { name: 'InfoId', defaultValue: this.props.infoId, render: <Input type="hidden" /> },
            { name: 'FlowNodeDataID', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'FreeFlowDataId', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            {
                title: '意见', name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            },
            {
                title: '选择发送人员',
                tips: '选择发送人员，则表示将此条数据提交给他人审阅；不选择代表当前审阅结束',
                render:
                <SelectUser
                    ref="selectUserForm"
                    nullable={true}
                    formType="freeflow"
                    flowNodeDataId={flowNodeData.ID}
                    onSubmit={this.handleSelect}
                />
            }
        ]
        return items
    }
    render() {
        const { flowNodeData } = this.props
        if (!flowNodeData) return null
        //if (this.state.treeData.length === 0) return null;
        return (
            <FormModal
                name="提交自由流程"
                trigger={this.props.trigger}
                onSubmit={this.handleSubmit}
                children={this.getFormItems(flowNodeData)}
            />
        )
    }
}
export default FreeFlowForm
