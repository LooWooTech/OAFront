import React, { Component } from 'react'
import FlowCheckModal from '../flowdata/_modal'
import { Button } from 'antd/lib/radio';
import auth from '../../models/auth'
import api from '../../models/api'

export default class UpdateApprovalModal extends Component {

    handleSubmit = (json) => {
        const model = this.props.model
        api.FormInfoExtend1.UpdateApproval(model.InfoId, () => {
            if (this.props.onSubmit)
                this.props.onSubmit()
        })
    }

    render() {
        const model = this.props.model
        const flowNodeData = model.FlowData.Nodes.sort((a, b) => a.ID > b.ID).find(e => auth.isCurrentUser(e.UserId))
        if (!flowNodeData || flowNodeData.Result !== null) {
            return null
        }
        return (
            <FlowCheckModal
                infoId={model.ID}
                onSubmit={this.handleSubmit}
                flowData={model.FlowData}
                flowNodeData={flowNodeData}
                canBack={true}
                trigger={<Button icon="check">审核</Button>}
            />
        )
    }
}
