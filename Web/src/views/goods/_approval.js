import React, { Component } from 'react'
import Modal from '../shared/_formmodal'
import { Button, Input, message, Radio } from 'antd';
import api from '../../models/api'
import moment from 'moment'
export default class GoodsApprovalModal extends Component {

    state = { result: true }

    handleSubmit = (data) => {
        api.Goods.Approval(data, () => {
            if (this.props.onSubmit) {
                this.props.onSubmit();
            }
        })
    }

    getItems = (model) => {
        let items = [
            { name: 'ApplyId', defaultValue: model.ID, render: <Input type="hidden" /> },
            { title: '物品名称', render: model.Name },
            { title: '申请数量', render: model.Number },
            { title: '申请人', render: model.ApplyUserName },
            { title: '申请说明', render: model.Note },
            { title: '申请日期', render: moment(model.CreateTime).format('lll') },
            {
                title: '审核', name: 'Result', defaultValue: this.state.result,
                render: <Radio.Group
                    onChange={e => this.setState({ result: e.target.value })}>
                    <Radio.Button value={true}>同意</Radio.Button>
                    <Radio.Button value={false}>不同意</Radio.Button>
                </Radio.Group>
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
                title="物品申请审核"
                trigger={this.props.trigger || <Button icon="check">审核</Button>}
                children={this.getItems(model)}
                onSubmit={this.handleSubmit}
            />
        )
    }
}
