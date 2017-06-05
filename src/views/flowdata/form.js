import React, { Component } from 'react'
import { Input, Radio, message } from 'antd'
import FormModal from '../shared/_formmodal'
import SelectUser from '../shared/_select_user'
import api from '../../models/api'

class FlowForm extends Component {
    state = { result: true, flowDataId: this.props.flowDataId, toUser: {} }


    componentWillMount() {

        api.FlowData.Model(this.state.flowDataId, data => {
            var flowNodeDataId = data.flowNodeData.$ref;
            data.flowNodeData = data.flowData.Nodes.find(e => e.$id === flowNodeDataId);
            this.setState({ ...data })
        })
    }


    handleSubmit = (data) => {
        data.ToUserId = this.state.toUser.ID || 0
        if (!this.state.canComplete && this.state.result && !data.ToUserId) {
            let users = this.refs.selectUserForm.getSelectedUsers()
            if (users.length > 0) {
                data.ToUserId = users[0].ID
            }
            else {
                message.error("请先选择发送人")
                return false
            }
        }

        data.Result = this.state.result;
        if (!data.Result && !confirm('你确定要退回吗？')) return false

        api.FlowData.Submit(data.ToUserId, data.InfoId, data, json => {
            this.setState({ visible: false })
            message.success("提交成功")

            const callback = this.props.callback
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
        let currentNode = flowData.Flow.Nodes.find(e => e.ID === flowNodeData.FlowNodeId)
        let prevNode = currentNode ? flowData.Flow.Nodes.find(e => e.ID === currentNode.PrevId) : null
        let nextNode = currentNode ? flowData.Flow.Nodes.find(e => e.PrevId === currentNode.ID) : null
        var items = [
            { name: 'InfoId', defaultValue: flowData.InfoId, render: <Input type="hidden" /> },
            { name: 'FlowNodeId', defaultValue: flowNodeData.FlowNodeId, render: <Input type="hidden" /> },
            { name: 'FlowDataId', defaultValue: flowNodeData.FlowDataId, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'UserId', defaultValue: flowNodeData.UserId, render: <Input type="hidden" /> },

        ]
        if (prevNode) {
            items.push({ title: '上一环节', render: prevNode.Name })
        }
        if (currentNode) {
            items.push({ title: '当前环节', render: currentNode.Name })
        }

        items.push({
            title: '意见', name: 'Content', defaultValue: flowNodeData.Content,
            render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        });
        if (canBack) {
            items.push({
                title: '审批结果',
                render:
                <Radio.Group value={this.state.result} onChange={e => this.setState({ result: e.target.value })}>
                    <Radio.Button value={true}>同意</Radio.Button>
                    <Radio.Button value={false}>不同意</Radio.Button>
                </Radio.Group>
            })
        }
        if (nextNode) {
            items.push({ title: '下一环节', render: nextNode.Name })
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
                extend: <span>{(this.state.toUser || {}).ID > 0 ? ' 已选 ' + this.state.toUser.RealName : ''}</span>
            })
        }
        return items
    }

    render() {
        if (!this.state.flowData) return null;
        if (this.state.flowNodeData.Result != null) return null;
        return (
            <span>
                <FormModal
                    name="提交审批流程"
                    trigger={this.props.children}
                    children={this.getFormItems()}
                    onSubmit={this.handleSubmit}
                />
            </span>
        )
    }
}
export default FlowForm
