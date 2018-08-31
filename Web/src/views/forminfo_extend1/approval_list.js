import React, { Component } from 'react'
import List from './_list'
import api from '../../models/api'
import auth from '../../models/auth'
import LeaveApprovalModal from '../attendance/_leave_approval'
import ApprovalModal from './_approval_modal'
import CheckLogModal from '../shared/_check_log_modal'
import UpdateApprovalModal from '../forminfo_extend1/_approval';

class ApprovalList extends Component {
    state = {
        status: 1,
        formId: parseInt(this.props.params.formId, 10) || 0
    }

    handleSubmit = () => {
        this.refs.list.reload();
    }

    defaultButtonsRender = (text, item) => {
        let buttons = [];
        if ((auth.hasRight('Form.Seal.View') || auth.isCurrentUser(item.UserId) || auth.isCurrentUser(item.approvalUserId)) && item.UpdateTime) {
            buttons.push(<CheckLogModal key="CheckLogModal" flowData={item.FlowData} />)
        }
        if (auth.isCurrentUser(item.ApprovalUserId)) {
            switch (this.state.formId) {
                case api.Forms.Leave.ID:
                    buttons.push(<LeaveApprovalModal key="LeaveApprovalModal" model={item} onSubmit={this.handleSubmit} />);
                    break;
                case api.Forms.Seal.ID:
                    buttons.push(<UpdateApprovalModal key="sealApprovalModal" model={item} onSubmit={this.handleSubmit} />)
                    break;
                default:
                    buttons.push(<ApprovalModal key="ApprovalModal" model={item} onSubmit={this.handleSubmit} />);
            }
        }
        return buttons;
    }

    render() {
        const user = auth.getUser()
        return <List
            ref="list"
            title={api.Form.GetName(this.state.formId) + '审核'}
            userId={auth.hasRight('Form.Seal.View') ? 0 : user.ID}
            formId={this.state.formId}
            buttons={this.defaultButtonsRender}
            status={this.props.location.query.status}
            page={this.props.location.query.page || 1}
        />
    }
}

export default ApprovalList