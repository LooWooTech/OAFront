import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Radio, message, Select } from 'antd'
import moment from 'moment'
import Modal from '../shared/_formmodal'
import api from '../../models/api'

class ApprovalLeaveModal extends Component {
    state = { loading: true, result: true, toUsers: [], hours: 24 }

    componentWillMount() {
        let model = this.props.model
        var hours = parseInt((moment(model.ScheduleEndTime) - moment(model.ScheduleBeginTime)) / 1000 / 60 / 60, 10)
        if (hours <= 24) {
            this.setState({ loading: false })
        }
        else {
            api.User.ParentTitleUserList(0, data => {
                this.setState({ toUsers: data, hours, loading: false })
            })
        }
    }

    handleSubmit = data => {
        let model = this.props.model
        if (this.state.hours > 48 && !data.toUserId && this.state.toUsers.length > 0) {
            message.error('请假超过48小时，请提交到局长审批');
            return false
        }
        api.Attendance.Approval(model.InfoId, data.result, data.toUserId, json => {
            message.success("已提交审核");
            if (this.props.onSubmit) {
                this.props.onSubmit();
            }
        });
    }

    getItems = (model) => {
        var items = [
            { title: '申请人', render: model.ApplyUser },
            { title: '申请时间', render: <span>{moment(model.ScheduleBeginTime).format('ll')} ~ {moment(model.ScheduleEndTime).format('ll')}</span> },
            {
                title: '审核结果', name: 'result', defaultValue: true,
                render: <Radio.Group>
                    <Radio.Button value={true}>同意</Radio.Button>
                    <Radio.Button value={false}>不同意</Radio.Button>
                </Radio.Group>
            }
        ];

        if (this.state.hours > 24 && this.state.toUsers.length > 0) {
            items.push({
                title: '审核人', name: 'toUserId', tips: '请假超过48小时，请提交到局长审批',
                render: <Select>
                    {this.state.toUsers.map(user => <Select.Option key={user.ID}>{user.RealName}</Select.Option>)}
                </Select>
            })
        }
        return items;
    }

    render() {
        let model = this.props.model
        if (model.Result !== null) {
            return null
        }
        return <Modal
            title="请假审核"
            children={this.getItems(model)}
            onSubmit={this.handleSubmit}
            trigger={<Button>审核</Button>}
        />
    }
}
ApprovalLeaveModal.propTypes = {
    model: PropTypes.object.isRequired,
}
export default ApprovalLeaveModal