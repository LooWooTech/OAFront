import React, { Component } from 'react'
import { Input, Radio } from 'antd'
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class CarEditModal extends Component {
    handleSubmit = values => {
        api.Car.Save(values, json => {
            this.props.onSubmit(json)
        });
    }
    render() {
        const model = this.props.model || {};
        return (
            <FormModal
                title={model.ID ? '编辑车辆信息' : '添加车辆'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger}
                children={[
                    { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
                    { title: '名称', name: 'Name', defaultValue: model.Name, render: <Input />, rules: [{ required: true, message: '请填写名称' }], },
                    { title: '车牌号', name: 'Number', defaultValue: model.Number, render: <Input />, rules: [{ required: true, message: '请填写车牌号' }], },
                    {
                        title: '车型', name: 'Type', defaultValue: model.Type || 1, render:
                        <Radio.Group>
                            <Radio.Button value={1}>轿车</Radio.Button>
                            <Radio.Button value={2}>SUV越野车</Radio.Button>
                            <Radio.Button value={3}>其他</Radio.Button>
                        </Radio.Group>
                    },
                ]}
            />
        )
    }
}

export default CarEditModal