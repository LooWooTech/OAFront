import React, { Component } from 'react';
import { Input, Select, Checkbox ,Button} from 'antd';
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class GoodsEditModal extends Component {
    state = {}
    handleSubmit = (values) => {
        api.Goods.Save(values, () => {
            this.props.onSubmit()
        });
    }

    getFormItems = (model) => {
        model = model || {}
        let items = [
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            {
                title: '名称', name: 'Name', defaultValue: model.Name, render: <Input />,
                rules: [{ required: true, message: '请填写名称' }]
            },
            {
                title: '介绍', name: 'Description', defaultValue: model.Description,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            },
            { title: '当前数量', name: 'Number', defaultValue: model.Number || 0, render: <Input disabled={true} /> },
            {
                title: '所属分类', name: 'CategoryId', defaultValue: (model.CategoryId || '').toString(),
                render: <Select>
                    {this.props.categories.map(c => <Select.Option key={c.ID} value={c.ID.toString()}>{c.Name}</Select.Option>)}
                </Select>
            }
        ]

        if (model.ID > 0 && model.Number > 0) {

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
        const model = this.props.model || {}
        return (
            <FormModal
                title={model.ID > 0 ? '修改物品' : '添加物品'}
                trigger={<Button>{model.ID ? '修改' : '添加物品'}</Button>}
                children={this.getFormItems(model)}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default GoodsEditModal;