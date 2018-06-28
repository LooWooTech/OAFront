import React, { Component } from 'react';
import { Input } from 'antd';
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class CategoryEditForm extends Component {

    state = { visible: false, };

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({ visible: true, });
    };

    hideModelHandler = () => {
        this.setState({ visible: false, });
    };

    handleSubmit = (values) => {
        api.Category.Save(values, () => {
            this.props.onSubmit()
        });
    }

    getFormItems = (model) => {
        let items = [
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            { name: 'ParentId', defaultValue: model.ParentId, render: <Input type="hidden" /> },
            { name: 'FormId', defaultValue: model.FormId, render: <Input type="hidden" /> },
            {
                title: '分类名称', name: 'Name', defaultValue: model.Name, render: <Input />,
                rules: [{ required: true, message: '请填写名称' }]
            }
        ]

        return items;
    }

    render() {
        const model = this.props.model
        return (
            <FormModal
                title={model.ID > 0 ? '修改分类' : model.ParentId > 0 ? '添加子类' : '添加分类'}
                trigger={this.props.trigger}
                children={this.getFormItems(model)}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default CategoryEditForm;