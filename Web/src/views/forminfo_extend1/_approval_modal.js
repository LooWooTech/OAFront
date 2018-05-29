import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Radio, message, Select, Input } from 'antd'
import moment from 'moment'
import Modal from '../shared/_formmodal'
import api from '../../models/api'


class ApprovalModal extends Component {
    state = { loading: true, result: true, toUsers: [] }

    componentWillMount() {
        api.User.ParentTitleUserList(0, data => {
            this.setState({ toUsers: data, loading: false })
        })
    }
    handleSubmit = data => {
        let model = this.props.model
        api.FormInfoExtend1.Approval(
            {
                id: model.ID,
                result: data.result,
                toUserId: data.toUserId,
                content: data.content
            }, json => {
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
            },
            {
                title: '审核内容', name: 'Content',
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            },
            {
                title: '审核人', name: 'toUserId', tips: '如果需要上级领导审核，请选择',
                render: <Select>
                    {this.state.toUsers.map(user => <Select.Option key={user.ID}>{user.RealName}</Select.Option>)}
                </Select>
            }
        ];
        return items;
    }

    render() {
        let model = this.props.model
        if (model.Result !== null) {
            return null
        }
        return <Modal
            title={this.props.title || '审核'}
            children={this.getItems(model)}
            onSubmit={this.handleSubmit}
            trigger={<Button>审核</Button>}
        />
    }
}
ApprovalModal.propTypes = {
    model: PropTypes.object.isRequired,
}
export default ApprovalModal