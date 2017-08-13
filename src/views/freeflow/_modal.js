import React, { Component } from 'react'
import { Input, Tag, message } from 'antd'
import SelectUser from '../shared/_user_select'
import Form from './_form'
import Modal from '../shared/_modal'

class FreeFlowFormModal extends Component {
    state = { users: [], cc_users: [] }

    handleSubmit = () => {
        const { flowNodeData } = this.props
        var toUserIds = this.refs.selectUserForm.getSelectedUsers().map(e => e.ID).join()
        var ccUserIds = this.refs.selectUserToCc.getSelectedUsers().map(e => e.ID).join()
        if (!flowNodeData.FreeFlowData) {
            if (!toUserIds && !ccUserIds) {
                message.error('请至少选择一个转发用户');
                return false;
            }
        }

        this.refs.form.submit(toUserIds, ccUserIds);
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
                title: '转发',
                tips: '请选择转发收件人，不选择则代表不转发',
                render:
                <SelectUser
                    ref="selectUserForm"
                    nullable={true}
                    formType="freeflow"
                    flowNodeDataId={flowNodeData.ID}
                    onSubmit={users => this.setState({ users: users || [] })}
                    title="选择转发人员"
                />,
                after: <span>{this.state.users.map(e => <Tag key={e.ID}>{e.RealName}</Tag>)}</span>
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
                />
            },
        ]
        return items
    }

    render() {
        const { flowNodeData } = this.props
        if (!flowNodeData) return null
        //if (this.state.treeData.length === 0) return null;
        return (
            <Modal
                title={this.props.title || '提交自由流程'}
                children={<Form {...this.props} ref="form"
                    items={this.getFormItems(flowNodeData)}
                    itemLayout={{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}
                    onSubmit={this.props.onSubmit}
                />}
                trigger={this.props.trigger}
                onSubmit={this.handleSubmit}
            />

        )
    }
}
export default FreeFlowFormModal
