import React, { Component } from 'react'
import { Input, Select, Checkbox, DatePicker, message } from 'antd'
import Modal from '../shared/_formmodal'
import UserSelectModal from '../shared/_user_select'
import moment from 'moment'
import api from '../../models/api'


export default class AddSubTaskModal extends Component {

    state = { leaders: [], loading: true, sms: true }

    componentWillMount() {
        //获取分管领导，hard code
        api.User.List({ groupId: 4 }, json => {
            this.setState({
                leaders: json.List,
                loading: false
            })
        })
    }

    handleSubmit = (data) => {
        if (!data.Content) {
            message.error('没有填写任务目标');
            return false;
        }
        let formData = { data }
        if (!data.ParentId) {
            let mainUsers = this.refs.mainUser.getSelectedUsers();
            if (mainUsers.length !== 1) {
                message.error("请选择主办负责人");
                return false;
            }
            else {
                formData.mainUserId = mainUsers[0].ID;
            }

            if (data.LeaderId < 1) {
                message.error("请选择分管领导");
                return false;
            }
        }

        let subUsers = this.refs.subUsers.getSelectedUsers();
        if (subUsers.length < 1 && data.ParentId > 0) {
            message.error("请选择协办人员");
            return false;
        }
        else {
            formData.subUserIds = subUsers.map(e => e.ID)
        }
        api.Task.SaveSubTasks(formData, (json) => {
            if (this.state.sms) {
                let userIds = [formData.mainUserId].concat(data.subUserIds).join();
                api.Sms.Send(userIds, data.TaskId)
            }
            this.props.onSubmit()
        });
    }

    getItems = (parent) => {
        var items = [
            { name: 'ID', defaultValue: 0, render: <Input type="hidden" /> },
            { name: 'TaskId', defaultValue: parent.TaskId || 0, render: <Input type="hidden" /> },
            { name: 'ParentId', defaultValue: parent.ID, render: <Input type="hidden" /> },
            {
                title: '任务目标', name: 'Content', defaultValue: parent.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />,
                rules: [{ required: true, message: '请填写任务目标' }],
            },
            {
                title: '派单时间', name: 'CreateTime',
                defaultValue: moment(),
                render: <DatePicker format="YYYY-MM-DD" />
            },
            {
                title: '计划完成时间', name: 'ScheduleDate',
                defaultValue: parent.ScheduleDate ? moment(parent.ScheduleDate) : null,
                render: <DatePicker format="YYYY-MM-DD" />
            },
        ];
        if (!parent.ID) {
            items.push({
                title: '主办负责人',
                render: <UserSelectModal multiple={false} ref="mainUser" />
            });
        }
        items.push({
            title: '协办负责人',
            render: <UserSelectModal multiple={true} ref="subUsers" />,
        });
        if (!parent.ID) {
            items.push({
                title: '分管领导', name: 'LeaderId', defaultValue: "",
                rules: [{ required: true, message: '请选择分管领导' }],
                render: (
                    <Select>
                        {(this.state.leaders || []).map(user => <Select.Option key={user.ID}>{user.RealName}</Select.Option>)}
                    </Select>
                ),
            })
        }
        items.push({
            title: '短信通知',
            render: <Checkbox checked={this.state.sms} onChange={e => this.setState({ sms: e.target.checked })}>短信通知</Checkbox>
        })
        return items;
    }

    render() {
        const parent = this.props.parent || {};

        return (
            <Modal
                title={parent.ID ? "添加协办任务" : "添加任务"}
                trigger={this.props.trigger}
                children={this.getItems(parent)}
                onSubmit={this.handleSubmit}
            />
        )
    }
}
