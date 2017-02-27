import React, { Component } from 'react'
import { Link } from 'react-router'
import { Form, Icon, Input, Button, Spin } from 'antd';
import '../../css/login.css'

import auth from '../../models/auth'
import api from '../../models/api'
import utils from '../../utils'

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Login extends Component {
    state = {loading:false}
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                api.UserLogin(this, values, json => {
                    auth.login(json);
                    utils.Redirect('/');
                })
            } else {
                console.log(err);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('name') && getFieldError('name');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const userNameDecorator = getFieldDecorator('name', { rules: [{ required: true, message: '请填写用户名' }], });
        const passwordDecorator = getFieldDecorator('password', { rules: [{ required: true, message: '请填写密码' }], });
        return (
            <div className="container">
            <div className="login-panel">
                <Spin spinning={this.state.loading} tip="登录中" >
                <Form inline onSubmit={this.handleSubmit} className="login-form">
                    <FormItem validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
                        {userNameDecorator(<Input addonBefore={<Icon type="user" />} placeholder="用户名" />)}
                    </FormItem>
                    <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''} >
                        {passwordDecorator(<Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />)}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>登录</Button>
                    </FormItem>
                    <FormItem>
                        &nbsp;<Link to="/user/findpassword">找回密码</Link>
                    </FormItem>
                </Form>
                </Spin>
            </div>
            </div>
        );
    }
}

const LoginPage = Form.create()(Login);
export default LoginPage;