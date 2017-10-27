import React, { Component } from 'react';
import { Input, Checkbox } from 'antd'
import Modal from '../shared/_formmodal'
import api from '../../models/api'

class AttendanceGroupEditModal extends Component {

    handleSubmit = (data) => {
        console.log(data)
        api.Attendance.SaveGroup(data, json => {
            if(this.props.onSubmit)
            this.props.onSubmit();
        });
    }
    render() {
        const model = this.props.model || {}
        return (
            <Modal
                title="考勤组配置"
                trigger={this.props.trigger}
                children={[
                    { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
                    { name: 'Name', title: '名称', defaultValue: model.Name || '', render: <Input /> , rules: [{ required: true, message: '请填写名称' }],},
                    { name: 'AMBeginTime', title: '上午开始时间', defaultValue: model.AMBeginTime || '05:00', render: <Input /> },
                    { name: 'AMEndTime', title: '上午结束时间', defaultValue: model.AMEndTime || '08:40', render: <Input /> },
                    { name: 'PMBeginTime', title: '下午开始时间', defaultValue: model.AMBeginTime || '17:20', render: <Input /> },
                    { name: 'PMEndTime', title: '下午结束时间', defaultValue: model.AMBeginTime || '22:00', render: <Input /> },
                    { name: 'API', title: '接口域名/IP', defaultValue: model.API || '', render: <Input /> },
                    {
                        name: 'Default', title: '是否默认', 
                        render: <Checkbox defaultChecked={model.Default === true}>设为默认分组</Checkbox>
                    }
                ]}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default AttendanceGroupEditModal;