import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Row, message, Button, Tag } from 'antd'
import SelectUser from '../shared/_user_select'
import Form from '../shared/_form'
import api from '../../models/api'

class FreeFlowNodeForm extends Component {
    state = { users: [], cc_users: [] }

    submit = (toUserIds, ccUserIds) => {
        var form = this.refs.form;
        form.validateFields((err, data) => {
            if (err) return false;
            api.FreeFlowData.Submit(data.FlowNodeDataID, data.InfoId, toUserIds, ccUserIds, data, json => {
                message.success("提交成功")
                const onSubmit = this.props.onSubmit
                if (onSubmit) {
                    onSubmit(json)
                }
                form.resetFields();
            })
        });
    }

    handleSubmit = () => {
        var toUserIds = this.refs.selectUserForm.getSelectedUsers().map(e => e.ID).join()
        var ccUserIds = this.refs.selectUserToCc.getSelectedUsers().map(e => e.ID).join()
        this.submit(toUserIds, ccUserIds)
    }

    getFormItems = (flowNodeData) => {
        const model = this.props.freeFlowNodeData || {}
        var items = [
            { name: 'InfoId', defaultValue: this.props.infoId, render: <Input type="hidden" /> },
            { name: 'FlowNodeDataID', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'FreeFlowDataId', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            {
                title: '意见',
                name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            },
            {
                render:
                <SelectUser
                    ref="selectUserForm"
                    nullable={true}
                    formType="freeflow"
                    flowNodeDataId={flowNodeData.ID}
                    onSubmit={users => this.setState({ users: users || [] })}
                    title="选择转发人员"
                    trigger={<Button>转发...</Button>}
                />,
                after: <span>{this.state.users.map(e => <Tag key={e.ID}>{e.RealName}</Tag>)}</span>
            },
            { render: <div style={{ marginTop: '10px' }}></div> },
            {
                render: <SelectUser
                    ref="selectUserToCc"
                    nullable={true}
                    formType="freeflow"
                    flowNodeDataId={flowNodeData.ID}
                    onSubmit={users => this.setState({ cc_users: users || [] })}
                    title="选择抄送人员（被抄送人可以不发表意见）"
                    trigger={<Button>抄送...</Button>}
                />
                ,
                after: <span>{this.state.cc_users.map(e => <Tag key={e.ID}>{e.RealName}</Tag>)}</span>
            },
            { render: <div style={{ marginTop: '10px' }}></div> },
            {
                render: <Row><Button type="primary" onClick={this.handleSubmit}>提交</Button></Row>
            }
        ]
        return items
    }
    render() {
        const { flowNodeData } = this.props
        if (!flowNodeData) return null
        //if (this.state.treeData.length === 0) return null;
        return (
            <Form
                ref="form"
                onSubmit={this.handleSubmit}
                children={this.props.items || this.getFormItems(flowNodeData)}
                itemLayout={this.props.itemLayout || { labelCol: { span: 24 }, wrapperCol: { span: 18 } }}
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
