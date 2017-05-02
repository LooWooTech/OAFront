import React, { Component } from 'react'
import { Input, DatePicker, Button, message } from 'antd'
import moment from 'moment'
import FormModal from '../shared/_formmodal'
import SelectUser from '../flowdata/select_user'
import api from '../../models/api'


class CarApplyModal extends Component {
    state = {}
    handleSubmit = (data) => {
        console.log(data);
        if (!data.UserId) {
            message.error("请选择发送人");
            return false;
        }

        data.Data.BeginDate = data.DateRange[0].format()
        data.Data.EndDate = data.DateRange[1].format()
        data.Title = "申请用车：" + data.Name;
        data.keywords = data.Name + ',' + data.Number;
        api.Car.Apply(data.CarId, data, json => {
            this.props.onSubmit(json);
        })
    }

    render() {
        const { car, flowId } = this.props
        if (!car || !flowId || !car.ID) return null

        return (
            <FormModal
                title="申请用车"
                trigger={<Button icon="check" type="primary">申请用车</Button>}
                onSubmit={this.handleSubmit}
                children={[
                    { name: 'Data.CarId', defaultValue: car.ID, render: <Input type="hidden" /> },
                    { name: 'FormId', defaultValue: api.Form.ID.Car, render: <Input type="hidden" /> },
                    { title: '申请车辆', name: 'Data.Name', defaultValue: car.Name, render: <Input disabled={true} /> },
                    { title: '车牌号码', name: 'Data.Number', defaultValue: car.Number, render: <Input disabled={true} /> },
                    { title: '申请日期', name: 'DateRange', render: <DatePicker.RangePicker />, rules: [{ required: true, message: '请选择用车日期' }], },
                    { title: '申请用途', name: 'Data.Reason', render: <Input type="textarea" autosize={{ row: 2 }} />, rules: [{ required: true, message: '请填写车辆申请用途' }] },
                    { name: 'UserId', defaultValue: this.state.ToUserId, render: <Input type="hidden" /> },
                    { title: '审批人', render: <SelectUser onChange={value => this.setState({ ToUserId: value })} flowId={this.props.flowId} />, },
                ]}
            />
        )
    }
}

export default CarApplyModal