import React, { Component } from 'react'
import { Input, DatePicker, Button, message, Radio } from 'antd'
import FormModal from '../shared/_formmodal'
import SelectUser from '../shared/_select_user'
import api from '../../models/api'

class LeaveApplyForm extends Component {
    state = {}
    handleSubmit = formData => {
        let users = this.refs.selectUserForm.getSelectedUsers()
        if (users.length > 0) {
            formData.ApprovalUserId = users[0].ID
        }
        else {
            message.error("请先选择发送人")
            return false
        }

        if (!formData.ScheduleBeginTime || !formData.ScheduleEndTime) {
            message.error("请选择使用日期")
            return false;
        }
        formData.ScheduleBeginTime = formData.ScheduleBeginTime.format()
        formData.ScheduleEndTime = formData.ScheduleEndTime.format()

        api.Attendance.Apply(formData, json => {
            if (this.props.onSubmit) {
                this.props.onSubmit(json);
            }
        })
    }

    handleSelect = (users) => {
        if (!this.state.canComplete && this.state.result && users && users.length === 0) {
            message.error("请先选择发送人")
            return false
        }
        this.setState({ toUser: users[0] })
    }

    render() {
        return (
            <FormModal
                title="申请假期"
                trigger={<Button icon="check" type="primary">申请假期</Button>}
                onSubmit={this.handleSubmit}
                children={[
                    {
                        title: '请假类型', name: 'Category', defaultValue: 1,
                        render: <Radio.Group>
                            <Radio value={1}>公事</Radio>
                            <Radio value={2}>私事</Radio>
                            <Radio value={3}>病假</Radio>
                            <Radio value={4}>调休</Radio>
                        </Radio.Group>,
                    },
                    { title: '开始日期', name: 'ScheduleBeginTime', render: <DatePicker />, rules: [{ required: true, message: '请选择开始日期' }], },
                    { title: '结束日期', name: 'ScheduleEndTime', render: <DatePicker />, rules: [{ required: true, message: '请选择结束日期' }], },
                    { title: '请假事由', name: 'Reason', render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 4 }} />, rules: [{ required: true, message: '请填写车辆申请用途' }] },
                    {
                        title: '审批人',
                        render: <SelectUser
                            formType="flow"
                            flowId={api.Forms.Car.ID}
                            flowStep={2}
                            onSubmit={this.handleSelect}
                            ref="selectUserForm"
                        />,
                        extend: <span>{(this.state.toUser || {}).ID > 0 ? ' 已选 ' + this.state.toUser.RealName : ''}</span>
                    },
                ]}
            />
        )
    }
}

export default LeaveApplyForm