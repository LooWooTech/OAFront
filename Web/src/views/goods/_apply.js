import React, { Component } from 'react'
import Modal from '../shared/_formmodal'
import { Button, Input, Checkbox } from 'antd';

export default class GoodsApplyFormModal extends Component {
    state = { disabled: this.props.model.Status === 0 }
    getItems = (model) => {
        let items = [
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            { title: '名称', name: 'Name', defaultValue: model.Name, render: <Input /> },
            { title: '介绍', name: 'Description', defaultValue: model.Description, render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} /> },
            { title: '当前数量', name: 'Number', defaultValue: model.Number, render: <Input disabled={true} /> },
        ];
        if (model.Number > 0) {

            items.push({
                title: '状态', name: 'Disabled',
                render: <Checkbox defaultChecked={this.state.disabled}
                    onChange={e => this.setState({ disabled: e.target.checked })}
                >停止认领</Checkbox>
            })
        }
        return items;
    }

    render() {
        const model = this.props.model;
        if (!model) return null;

        return (
            <Modal
                trigger={<Button icon="add">申请</Button>}
                children={this.getItems(model)}
            />
        )
    }
}
