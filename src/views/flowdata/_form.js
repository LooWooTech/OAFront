import React, { Component } from 'react'
import { Input, Radio, message } from 'antd'
import Form from '../shared/_form'
import SelectUser from '../shared/_user_select'
import api from '../../models/api'

class FlowForm extends Component {
    state = { result: true, toUser: {}, ...this.props }

    handleSubmit = (data) => {
        data.ToUserId = this.state.toUser.ID || 0
        if (!this.state.canComplete && this.state.result && !data.ToUserId) {
            let users = this.refs.selectUserForm.getSelectedUsers()
            if (users.length > 0) {
                data.ToUserId = users[0].ID || 0;
            }
            if (!data.ToUserId) {
                message.error("请先选择发送人")
                return false
            }
        }
        data.Result = this.state.result;
        if (!data.Result && !confirm('你确定要退回吗？')) return false

        api.FlowData.Submit(data.ToUserId, data.InfoId, data, json => {
            this.setState({ visible: false })
            message.success("提交成功")

            const callback = this.props.onSubmit
            if (callback) {
                callback(json)
            }
        })
    }

    handleSelect = (users) => {
        if (!this.state.canComplete && this.state.result && users && users.length === 0) {
            message.error("请先选择发送人")
            return false
        }
        this.setState({ toUser: users[0] })
    }

    getFormItems = () => {
        let { flowNodeData, flowData, canBack, canComplete } = this.state;
        var items = [
            { name: 'InfoId', defaultValue: flowData.InfoId, render: <Input type="hidden" /> },
            { name: 'FlowNodeId', defaultValue: flowNodeData.FlowNodeId, render: <Input type="hidden" /> },
            { name: 'FlowDataId', defaultValue: flowNodeData.FlowDataId, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'UserId', defaultValue: flowNodeData.UserId, render: <Input type="hidden" /> },

        ]
        items.push({
            title: '意见', name: 'Content', defaultValue: flowNodeData.Content,
            render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        });
        if (canBack) {
            items.push({
                title: '审核结果',
                render:
                <Radio.Group value={this.state.result} onChange={e => this.setState({ result: e.target.value })}>
                    <Radio.Button value={true}>同意</Radio.Button>
                    <Radio.Button value={false}>不同意</Radio.Button>
                </Radio.Group>
            })
        }
        //如果可以结束，且同意，则不需要选择发送人
        if (!canComplete && this.state.result) {
            items.push({
                title: '选择发送人员',
                render:
                <SelectUser
                    ref="selectUserForm"
                    flowNodeDataId={flowNodeData.ID}
                    onSubmit={this.handleSelect}
                    formType="flow"
                />,
                before: <span>{(this.state.toUser || {}).ID > 0 ? ' 已选 ' + this.state.toUser.RealName : ''}</span>
            })
        }
        return items
    }

    render() {

        if (!this.state.flowData) return null;
        if (this.state.flowNodeData.Result != null) return null;
        return <Form
            children={this.getFormItems()}
            onSubmit={this.handleSubmit}
        />
    }
}
export default FlowForm
