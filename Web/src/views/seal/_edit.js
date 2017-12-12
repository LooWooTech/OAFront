import React, { Component } from 'react'
import { Input } from 'antd'
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class SealEditModal extends Component {
    handleSubmit = values => {
        api.Seal.Save(values, json => {
            this.props.onSubmit(json)
        });
    }
    render() {
        const model = this.props.model || {};
        return (
            <FormModal
                title={model.ID ? '编辑图章信息' : '添加图章'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger}
                children={[
                    { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
                    { title: '名称', name: 'Name', defaultValue: model.Name, render: <Input />, rules: [{ required: true, message: '请填写名称' }], },
                ]}
            />
        )
    }
}

export default SealEditModal