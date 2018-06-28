import React, { Component } from 'react'
import Modal from '../shared/_formmodal'
import { Button, Input, Checkbox } from 'antd';

export default class GoodsApplyFormModal extends Component {
    state = { disabled: this.props.model.Status === 0 }
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
            { title: '备注', name: 'Note', render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} /> }
        ];
        return items;
    }

    render() {
        const model = this.props.model;
        if (!model) return null;

        return (
            <Modal
                title="物品申请"
                trigger={<Button icon="add">申请</Button>}
                children={this.getItems(model)}
            />
        )
    }
}
