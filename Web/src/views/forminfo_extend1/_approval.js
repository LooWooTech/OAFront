import React, { Component } from 'react'
import FlowCheckModal from '../flowdata/_modal'
import { Button, Icon } from 'antd';
import api from '../../models/api'

export default class UpdateApprovalModal extends Component {

    handleSubmit = () => {
        const model = this.props.model
        api.FormInfoExtend1.UpdateApproval(model.InfoId, () => {
            if (this.props.onSubmit)
                this.props.onSubmit()
        })
    }

    getItems = (model) => {
        if (model.AttachmentId) {
            return [{
                title: '附件',
                render: (
                    <a href={api.File.PreviewUrl(model.AttachmentId)}>
                        <Icon type="eye" /> 点击查看
                    </a>
                )
            }]
        }
        return []
    }

    render() {
        const model = this.props.model

        return (
            <FlowCheckModal
                infoId={model.ID}
                onSubmit={this.handleSubmit}
                flowData={model.FlowData}
                canBack={true}
                trigger={<Button icon="check">审核</Button>}
                extendItems={this.getItems(model)}
            />
        )
    }
}
