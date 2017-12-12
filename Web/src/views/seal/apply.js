import React, { Component } from 'react'
import { Input, DatePicker, Button, message, Select } from 'antd'
import FormModal from '../shared/_formmodal'
import SelectUser from '../shared/_user_select'
import api from '../../models/api'

class SealApplyModal extends Component {
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

        let sealId = formData.InfoId;
        if (!sealId) {
            message.error("参数不正确");
            return false;
        }
        if (!formData.ScheduleBeginTime || !formData.ScheduleEndTime) {
            message.error("请选择使用日期")
            return false;
        }
        formData.ScheduleBeginTime = formData.ScheduleBeginTime.format()
        formData.ScheduleEndTime = formData.ScheduleEndTime.format()

        api.Seal.Apply(formData, json => {
            message.success('申请完成，请等待审核');
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

        const seals = this.props.seals || []
        return (
            <FormModal
                title="申请图章"
                trigger={<Button icon="check" type="primary">申请图章</Button>}
                onSubmit={this.handleSubmit}
                children={[
                    {
                        title: '申请图章', name: 'InfoId', defaultValue: '',
                        rules: [{ required: true, message: '请选择申请图章' }],
                        render: <Select>
                            {seals.map(seal => <Select.Option key={seal.ID}>{seal.Name}（{seal.Number}）</Select.Option>)}
                        </Select>
                    },
                    { title: '开始日期', name: 'ScheduleBeginTime', render: <DatePicker />, rules: [{ required: true, message: '请选择开始日期' }], },
                    { title: '结束日期', name: 'ScheduleEndTime', render: <DatePicker />, rules: [{ required: true, message: '请选择结束日期' }], },
                    { title: '申请用途', name: 'Reason', render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 4 }} />, rules: [{ required: true, message: '请填写车辆申请用途' }] },
                    {
                        title: '审核人',
                        render: <SelectUser
                            formType="flow"
                            flowId={api.Forms.Seal.ID}
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

export default SealApplyModal