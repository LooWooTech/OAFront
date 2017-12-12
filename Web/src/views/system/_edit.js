import React, { Component } from 'react'
import { Input } from 'antd'
import Modal from '../shared/_formmodal'
import api from '../../models/api'

class ConfigEditModal extends Component {
    state = { toUser: {} }
    handleSubmit = (data) => {
        api.Config.Save(data, () => {
            this.props.onSubmit()
        })
    }
    render() {
        const model = this.props.model || {}

        return (
            <Modal
                title={model.Key ? "修改参数" : "添加参数"}
                trigger={this.props.trigger}
                children={[
                    { title: '键', name: 'Key', defaultValue: model.Key || 0, render: <Input /> },
                    { title: '值', name: 'Value', defaultValue: model.Value || 0, render: <Input /> },
                ]}
                onSubmit={this.handleSubmit}
            />
        )
    }
}
export default ConfigEditModal