import React, { Component } from 'react'
import { Input, DatePicker, Button, message, Radio, Select } from 'antd'
import FormModal from '../shared/_formmodal'
import api from '../../models/api'
import utils from '../../utils'

class LeaveApplyForm extends Component {
    state = { toUsers: [], loading: true }

    componentWillMount() {
        api.User.ParentTitleUserList(0, data => {
            this.setState({ toUsers: data, loading: false })
        })
    }

    handleSubmit = formData => {
        if (!formData.ApprovalUserId) {
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
            message.success("申请成功，请等待审核");
            utils.Redirect(`/extend1/${api.Forms.Leave.ID}/requests`)
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
        if (this.state.loading) return null
        return (
            <FormModal
                title="申请假期"
                trigger={<Button icon="check" type="primary">申请假期</Button>}
                onSubmit={this.handleSubmit}
                children={[
                    {
                        title: '请假类型', name: 'InfoId', defaultValue: 1,
                        render: <Radio.Group>
                            <Radio value={1}>公事</Radio>
                            <Radio value={2}>私事</Radio>
                            <Radio value={3}>病假</Radio>
                            <Radio value={4}>调休</Radio>
                        </Radio.Group>,
                    },
                    {
                        title: '开始日期', name: 'ScheduleBeginTime',
                        render: <DatePicker showTime format="YYYY-MM-DD HH:mm" />,
                        rules: [{ required: true, message: '请选择开始日期' }],
                    },
                    {
                        title: '结束日期', name: 'ScheduleEndTime',
                        render: <DatePicker showTime format="YYYY-MM-DD HH:mm" />,
                        rules: [{ required: true, message: '请选择结束日期' }],
                    },
                    {
                        title: '请假事由', name: 'Reason',
                        render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 4 }} />,
                        rules: [{ required: true, message: '请填写请假理由' }]
                    },
                    {
                        title: '审核人',
                        name: 'ApprovalUserId',
                        render: <Select>
                            {this.state.toUsers.map(user => <Select.Option key={user.ID}>{user.RealName}</Select.Option>)}
                        </Select>,
                    },
                ]}
            />
        )
    }
}

export default LeaveApplyForm