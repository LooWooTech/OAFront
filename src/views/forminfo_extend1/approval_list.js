import React, { Component } from 'react'
import { Button } from 'antd'
import List from './_list'
import api from '../../models/api'
import auth from '../../models/auth'
import SubmitFlowModal from '../flowdata/_modal'
import LeaveApprovalModal from '../attendance/_leave_approval'

class ApprovalList extends Component {
    state = {
        status: 1,
        //infoId: parseInt(this.props.infoId || (this.props.params && this.props.params.infoId), 10) || 0,
        formId: parseInt(this.props.params.formId, 10) || 0
    }

    handleSubmit = () => {
        this.refs.list.reload();
    }

    defaultButtonsRender = (text, item) => {
        if (!auth.isCurrentUser(item.ApprovalUserId)) {
            return '';
        }
        else {
            switch (this.state.formId) {
                case api.Forms.Leave.ID:
                    return <LeaveApprovalModal model={item} onSubmit={this.handleSubmit} />
                default:
                    return <SubmitFlowModal
                        infoId={item.ID}
                        flowDataId={item.FlowDataId}
                        trigger={<Button>审核</Button>}
                        callback={this.handleSubmitFlowCallback}
                    />
            }
        }
    }

    render() {
        let user = auth.getUser()
        return <List
            ref="list"
            approvalUserId={user.ID}
            formId={this.state.formId}
            infoId={this.props.infoId}
            buttons={this.defaultButtonsRender}
        />
    }
}

export default ApprovalList