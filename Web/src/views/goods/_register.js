import React, { Component } from 'react';
import { Input, Select, Checkbox, Button } from 'antd';
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class GoodsRegisterModal extends Component {

    handleSubmit = (data) => {
        api.Goods.Register(data.GoodsId, data.Number, () => {
            this.props.onSubmit()
        });
    }

    getFormItems = (model) => {
        model = model || {}
        let items = [
            { name: 'GoodsId', defaultValue: model.ID, render: <Input type="hidden" /> },
            {
                title: '物品', render: <span>{model.Name}</span>
            },
            { title: '当前数量', render: <span>{model.Number}</span> },
            { title: '新增数量', name: 'Number', render: <Input /> },
        ]

        return items;
    }

    render() {
        const model = this.props.model || {}
        return (
            <FormModal
                title='登记物品'
                trigger={<Button>登记</Button>}
                children={this.getFormItems(model)}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default GoodsRegisterModal;