import React, { Component } from 'react'
import { Input, Radio, message } from 'antd'
import FormModal from '../shared/_formmodal'
import SelectUser from './select_user'
import api from '../../models/api'

class FlowForm extends Component {
    state = { result: true, flowDataId: this.props.flowDataId }


    componentWillMount() {

        api.FlowData.Model(this.state.flowDataId, data => {
            var flowNodeDataId = data.flowNodeData.$ref;
            data.flowNodeData = data.flowData.Nodes.find(e => e.$id === flowNodeDataId);
            this.setState({ ...data })
        })
    }


    handleSubmit = (data) => {

        if (!this.state.canComplete && this.state.result && !data.ToUserId) {
            message.error("请先选择发送人")
            return false
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

    getFormItems = () => {
        let { flowNodeData, flowData, canBack, canComplete } = this.state;
        var items = [
            { name: 'InfoId', defaultValue: flowData.InfoId, render: <Input type="hidden" /> },
            { name: 'FlowNodeId', defaultValue: flowNodeData.FlowNodeId, render: <Input type="hidden" /> },
            { name: 'FlowDataId', defaultValue: flowNodeData.FlowDataId, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'UserId', defaultValue: flowNodeData.UserId, render: <Input type="hidden" /> },
            {
                title: '意见', name: 'Content', defaultValue: flowNodeData.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            }
        ]
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
        //如果可以结束，且同意，则不需要选择发送人
        if (!canComplete && this.state.result) {
            items.push({ name: 'ToUserId', defaultValue: this.state.toUserId, render: <Input type="hidden" /> });
            items.push({
                title: '选择发送人',
                render:
                <SelectUser
                    flowId={flowData.FlowId}
                    nodeId={flowNodeData.FlowNodeId}
                    nodeDataId={flowNodeData.ID}
                    flowDataId={flowNodeData.FlowDataId}
                    onChange={value => this.setState({ toUserId: value })}
                />
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
