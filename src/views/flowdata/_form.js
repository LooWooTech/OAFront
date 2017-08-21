import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Radio, message, Row, Col, Button } from 'antd'
import Form from '../shared/_form'
import SelectUser from '../shared/_user_select'
import api from '../../models/api'
import auth from '../../models/auth'

class FlowNodeDataForm extends Component {
    state = {
        result: true,
        toUser: {},
        ...this.props,
        itemLayout: this.props.itemLayout || { labelCol: { span: 2 }, wrapperCol: { span: 16 } }
    }

    submit = (callback) => {
        var form = this.refs.form;
        form.validateFields((err, data) => {
            data.ToUserId = this.state.toUser.ID || 0
            if (!this.props.canComplete && this.state.result && !data.ToUserId) {
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
                this.setState({ visible: false }, () => {
                    message.success("提交成功")

                    const callback = this.props.onSubmit
                    if (callback) {
                        callback(json)
                    }
                })
            })

        });
    }

    handleSelect = (users) => {
        if (!this.props.canComplete && this.state.result && users && users.length === 0) {
            message.error("请先选择发送人")
            return false
        }
        this.setState({ toUser: users[0] })
    }

    getFormItems = () => {
        let { flowNodeData, flowData, canBack, canComplete } = this.props;
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
                title: '审核结果',
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
                    trigger={<Button>{(this.state.toUser || {}).ID > 0 ? ' 已选 ' + this.state.toUser.RealName : '选择...'}</Button>}
                />,
            })
        }
        if (!this.props.isModal) {
            items.push({
                render: <Row><Col offset={this.state.itemLayout.labelCol.span}>
                    <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                </Col></Row>,
            });
        }
        return items
    }

    render() {
        if (!this.state.flowData || !this.state.flowNodeData) return null;
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
    flowData: PropTypes.object.isRequired,
    flowNodeData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
}
export default FlowNodeDataForm