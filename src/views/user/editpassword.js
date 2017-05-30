import React, { Component } from 'react'
import { Input, message } from 'antd'
import api from '../../models/api'
import Modal from '../shared/_formmodal'

class EditPassword extends Component {
    handleSubmit = (data) => {
        if (data.NewPassword !== data.RePassword) {
            message.error("两次输入密码不一致")
            return false
        }
        api.User.EditPassword(data, json => {
            message.success("修改完成")
        })
    }
    render() {
        return (
            <Modal
                title="修改密码"
                trigger={<span>{this.props.trigger}</span>}
                onSubmit={this.handleSubmit}
                children={[
                    { name: 'OldPassword', title: '原密码', render: <Input type="password" />, rules: [{ required: true, message: '请填写旧密码' }], },
                    { name: 'NewPassword', title: '新密码', render: <Input type="password" />, rules: [{ required: true, message: '请填写新密码' }], },
                    { name: 'RePassword', title: '确认密码', render: <Input type="password" />, rules: [{ required: true, message: '请填写确认密码' }], },
                ]}
            />
        );
    }
}

export default EditPassword;