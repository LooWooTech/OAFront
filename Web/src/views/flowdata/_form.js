import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Radio, message, Row, Col, Button, Checkbox, Modal } from 'antd'
import Form from '../shared/_form'
import SelectUser from '../shared/_user_select'
import api from '../../models/api'
import auth from '../../models/auth'

class FlowNodeDataForm extends Component {
    state = {
        result: true,
        toUser: {},
        sms: true,
        ...this.props,
        itemLayout: this.props.itemLayout || { labelCol: { span: 2 }, wrapperCol: { span: 16 } }
    }

    submit = () => {
        var form = this.refs.form;
        form.validateFields((err, data) => {
            let users = this.refs.selectUserForm ? this.refs.selectUserForm.getSelectedUsers() : []
            data.ToUserId = users.length > 0 ? users[0].ID : 0;
            data.Result = this.state.result;
            if (!this.state.canComplete && data.Result && !data.ToUserId) {
                message.error("请先选择发送人")
                return false
            }

            if (!data.Result) {
                if (!data.Content) {
                    message.error("请填写退回原因");
                    
                    return false;
                }
                Modal.confirm({
                    title: '提醒',
                    content: '你确定要退回吗？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.submitFlowData(data)
                    }
                })
            } else {
                this.submitFlowData(data)
            }
        });
    }

    handleDisagree = () => {
        this.setState({ result: false }, () => {
            this.submit()
        })
    }

    submitFlowData = data => {
        api.FlowData.Submit(data, json => {
            this.setState({ visible: false }, () => {
                message.success("提交成功")
                if (this.state.sms) {
                    api.Sms.Send(data.ToUserId, data.InfoId);
                }
                if (this.props.onSubmit) {
                    this.props.onSubmit(json)
                }
            })
        })
    }

    getNextNodes = () => {
        let flowNodes = this.state.flowData.Flow.Nodes;
        var list = [];
        let prevNode = flowNodes.find(e => e.ID === this.state.flowNodeData.FlowNodeId)
        do {
            let nextNode = flowNodes.find(e => e.PrevId === prevNode.ID);
            list.push(nextNode);
            prevNode = nextNode;
        }
        while (prevNode && prevNode.CanSkip)
        return list;
    }

    getFormItems = () => {
        let { flowNodeData, flowData, canBack, canComplete } = this.state;
        let flowNodes = flowData.Flow.Nodes;
        let currentNode = flowNodes.find(e => e.ID === flowNodeData.FlowNodeId)
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

        if (nextNode && this.state.result) {
            //如果下一个节点可以跳过，则罗列出后面所有可以跳过的节点 直到最后一个不可以跳过的节点为止
            let nextFlowNodeId = this.state.nextFlowNodeId === undefined ? nextNode.ID : this.state.nextFlowNodeId
            if (nextNode.CanSkip) {
                let nextNodes = this.getNextNodes();
                items.push({
                    title: '下一环节', name: 'NextFlowNodeId', defaultValue: nextFlowNodeId,
                    render: <Radio.Group onChange={(e) => this.setState({ nextFlowNodeId: e.target.value })}>
                        {nextNodes.map(e => <Radio.Button key={e.ID} value={e.ID}>{e.Name}</Radio.Button>)}
                    </Radio.Group>
                });
            }
            else {
                items.push({ title: '下一环节', render: nextNode.Name })
            }
            //如果可以结束，且同意，则不需要选择发送人
            if (!canComplete) {
                items.push({
                    title: '选择发送人员',
                    render:
                        <SelectUser
                            ref="selectUserForm"
                            flowNodeId={nextFlowNodeId}
                            onSubmit={this.handleSelect}
                            flowDataId={flowData.ID}
                            formType="flow"
                        />,
                    after: <div><Checkbox checked={this.state.sms} onChange={e => this.setState({ sms: e.target.checked })}>短信通知</Checkbox></div>
                })
            }
        }

        if (!this.props.isModal) {
            items.push({
                render: <Row>
                    <Col offset={this.state.itemLayout.labelCol.span}>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                        &nbsp;&nbsp;
                        {canBack ? <Button type="danger" onClick={this.handleDisagree}>退回</Button> : null}
                    </Col>
                </Row>,
            });
        }
        else {
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
        }
        return items
    }

    render() {
        if (this.state.loading || !this.state.flowData || !this.state.flowNodeData) return null;
        if (this.state.flowNodeData.Result != null || !auth.isCurrentUser(this.state.flowNodeData.UserId)) return null;
        return <Form
            ref="form"
            children={this.getFormItems()}
            onSubmit={this.submit}
            itemLayout={this.state.itemLayout}
        />

    }
}
FlowNodeDataForm.propTypes = {
    infoId: PropTypes.number.isRequired,
    flowData: PropTypes.object,
    flowNodeData: PropTypes.object,
    onSubmit: PropTypes.func,
}
export default FlowNodeDataForm