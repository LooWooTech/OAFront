import React, { Component } from 'react'
import { Input, DatePicker, Button, message } from 'antd'
import FormModal from '../shared/_formmodal'
import SelectUser from '../flowdata/select_user'
import api from '../../models/api'


class CarApplyModal extends Component {
    state = {}
    handleSubmit = formData => {
        if (!this.state.toUserId) {
            message.error("请选择发送人");
            return false;
        }
        let carId = formData.Data.CarId;
        if (!carId) {
            message.error("参数不正确");
            return false;
        }
        if (!formData.BeginDate || !formData.EndDate) {
            message.error("请选择使用日期")
            return false;
        }
        formData.Data.BeginDate = formData.BeginDate.format()
        formData.Data.EndDate = formData.EndDate.format()
        formData.Title = "申请用车：" + formData.Data.Name;
        formData.keywords = formData.Data.Name + ',' + formData.Data.Number;
        formData.Description = formData.Data.Reason;
        api.Car.Apply(carId, this.state.toUserId, formData, json => {
            this.props.onSubmit(json);
        })
    }

    render() {
        const { car, flowId } = this.props
        if (!car || !flowId || !car.ID) return null

        return (
            <FormModal
                title="申请用车"
                trigger={<Button icon="check" type="primary">申请</Button>}
                onSubmit={this.handleSubmit}
                children={[
                    { name: 'Data.CarId', defaultValue: car.ID, render: <Input type="hidden" /> },
                    { name: 'FormId', defaultValue: api.Form.ID.Car, render: <Input type="hidden" /> },
                    { title: '申请车辆', name: 'Data.Name', defaultValue: car.Name, render: <Input disabled={true} /> },
                    { title: '车牌号码', name: 'Data.Number', defaultValue: car.Number, render: <Input disabled={true} /> },
                    { title: '开始日期', name: 'BeginDate', render: <DatePicker />, rules: [{ required: true, message: '请选择开始日期' }], },
                    { title: '结束日期', name: 'EndDate', render: <DatePicker />, rules: [{ required: true, message: '请选择结束日期' }], },
                    { title: '申请用途', name: 'Data.Reason', render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 4 }} />, rules: [{ required: true, message: '请填写车辆申请用途' }] },
                    { title: '审批人', render: <SelectUser onChange={value => this.setState({ toUserId: value })} flowId={this.props.flowId} />, },
                ]}
            />
        )
    }
}

export default CarApplyModal