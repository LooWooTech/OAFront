import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Row, Col, message, Button, Checkbox } from 'antd'
import SelectUser from '../shared/_user_select'
import Form from '../shared/_form'
import api from '../../models/api'

class FreeFlowNodeForm extends Component {
    state = {
        sms_to: true,
        sms_cc: false,
        itemLayout: this.props.itemLayout || { labelCol: { span: 2 }, wrapperCol: { span: 16 } },
        users: [],
        cc_users: []
    }

    submit = (callback) => {
        var toUserIds = this.refs.selectUserForm.getSelectedUsers().map(e => e.ID).join()
        var ccUserIds = this.refs.selectUserToCc.getSelectedUsers().map(e => e.ID).join()
        var form = this.refs.form;
        form.validateFields((err, data) => {
            if (err) return false;
            api.FreeFlowData.Submit(data.FlowNodeDataID, data.InfoId, toUserIds, ccUserIds, data, json => {
                message.success("提交成功")

                if (this.state.sms_to) {
                    api.Sms.Send(toUserIds, data.InfoId);
                }
                if (this.state.sms_cc) {
                    api.Sms.Send(ccUserIds, data.InfoId);
                }

                callback = this.props.onSubmit || callback
                if (callback && typeof (callback) === 'function') {
                    callback(json)
                }
                form.resetFields();
            })
        });
    }

    getFormItems = (flowNodeData) => {
        const model = this.props.freeFlowNodeData || {}
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
                title: '转发',
                tips: '请选择转发收件人，不选择则代表不转发',
                render:
                <SelectUser
                    ref="selectUserForm"
                    nullable={true}
                    formType="freeflow"
                    flowNodeDataId={flowNodeData.ID}
                    title="选择转发人员"
                />,
                after: <div><Checkbox checked={this.state.sms_to} onChange={e => this.setState({ sms_to: e.target.checked })}>短信通知</Checkbox></div>
            },
            {
                title: '抄送',
                tips: '被抄送人可以不发表意见',
                render: <SelectUser
                    ref="selectUserToCc"
                    nullable={true}
                    formType="freeflow"
                    flowNodeDataId={flowNodeData.ID}
                    title="选择抄送人员"
                />,
                after: <div><Checkbox checked={this.state.sms_cc} onChange={e => this.setState({ sms_cc: e.target.checked })}>短信通知</Checkbox></div>
            }
        ]
        if (!this.props.isModal) {
            items.push({
                render: <Row><Col offset={this.state.itemLayout.labelCol.span}>
                    <Button type="primary" onClick={this.submit}>提交</Button>
                </Col></Row>,
            });
        }
        return items
    }
    render() {
        const { flowNodeData } = this.props
        if (!flowNodeData) return null
        //if (this.state.treeData.length === 0) return null;
        return (
            <Form
                ref="form"
                onSubmit={this.submit}
                children={this.props.items || this.getFormItems(flowNodeData)}
                itemLayout={this.state.itemLayout}
            />
        )
    }
}
FreeFlowNodeForm.propTypes = {
    infoId: PropTypes.number.isRequired,
    freeFlowNodeData: PropTypes.object,
    flowNodeData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
}
export default FreeFlowNodeForm
