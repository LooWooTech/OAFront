import React, { Component } from 'react'
import Modal from '../shared/_formmodal'
import { Button, Input, Checkbox, message } from 'antd';
import api from '../../models/api'
import SelectUser from '../shared/_user_select'

export default class GoodsApplyFormModal extends Component {
    state = { disabled: this.props.model.Status === 0 }

    handleSubmit = (data) => {
        let users = this.refs.selectUserForm.getSelectedUsers()
        if (users.length > 0) {
            data.ApprovalUserId = users[0].ID
        }
        else {
            message.error("请先选择发送人")
            return false
        }

        if (data.Number > data.MaxNumber) {
            message.error('申请数量过多')
            return false;
        }
        api.Goods.Apply(data, () => {
            message.success('申请完成，请等待审核');
            if (this.props.onSubmit) {
                this.props.onSubmit();
            } 
        })
    }

    getItems = (model) => {
        let items = [
            { name: 'GoodsId', defaultValue: model.ID, render: <Input type="hidden" /> },
            { name: 'MaxNumber', defaultValue: model.Number, render: <Input type="hidden" /> },
            { title: '名称', render: model.Name },
            {
                title: '申请数量', name: 'Number',
                defaultValue: 1,
                render: <Input />
            },
            { title: '备注', name: 'Note', render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} /> },
            {
                title: '审核人',
                render: <SelectUser
                    formType="flow"
                    flowId={api.Forms.Goods.ID}
                    flowStep={2}
                    onSubmit={this.handleSelect}
                    ref="selectUserForm"
                />
            },
        ];
        return items;
    }

    handleSelect = (users) => {
        if (!this.state.canComplete && this.state.result && users && users.length === 0) {
            message.error("请先选择发送人")
            return false
        }
        this.setState({ toUser: users[0] })
    }

    render() {
        const model = this.props.model;
        if (!model) return null;

        return (
            <Modal
                title="物品申请"
                trigger={<Button icon="add">申请</Button>}
                children={this.getItems(model)}
                onSubmit={this.handleSubmit}
            />
        )
    }
}
