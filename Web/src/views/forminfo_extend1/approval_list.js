import React, { Component } from 'react'
import List from './_list'
import api from '../../models/api'
import auth from '../../models/auth'
import LeaveApprovalModal from '../attendance/_leave_approval'
import ApprovalModal from './_approval_modal'
import CheckLogModal from '../shared/_check_log_modal'

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
        if ((auth.isCurrentUser(item.UsreId) || auth.isCurrentUser(item.approvalUserId)) && item.UpdateTime) {
            buttons.push(<CheckLogModal flowData={item.FlowData} />)
        }
        if (auth.isCurrentUser(item.ApprovalUserId)) {
            switch (this.state.formId) {
                case api.Forms.Leave.ID:
                    buttons.push(<LeaveApprovalModal model={item} onSubmit={this.handleSubmit} />);
                    break;
                default:
                    buttons.push(<ApprovalModal model={item} onSubmit={this.handleSubmit} />);
            }
        }
        return buttons;
    }

    render() {
        let user = auth.getUser()
        return <List
            ref="list"
            title={api.Form.GetName(this.state.formId) + '审核'}
            approvalUserId={user.ID}
            formId={this.state.formId}
            buttons={this.defaultButtonsRender}
        />
    }
}

export default ApprovalList