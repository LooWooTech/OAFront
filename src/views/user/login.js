import React, { Component } from 'react'
import { Link } from 'react-router'
import { Form, Icon, Input, Button } from 'antd';
import '../../css/login.css'

import auth from '../../models/auth'
import api from '../../models/api'
import utils from '../../utils'

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Login extends Component {
    state = { loading: false }
    handleSubmit = (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                api.User.Login(values, json => {
                    auth.login(json);
                    utils.Redirect('/');
                })
            } else {
                this.setState({ loading: false });
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const userNameDecorator = getFieldDecorator('username', { rules: [{ required: true, message: '请填写用户名' }], });
        const passwordDecorator = getFieldDecorator('password', { rules: [{ required: true, message: '请填写密码' }], });
        return (
            <div className="container">
                <div className="login-panel">
                    <Form layout="inline" onSubmit={this.handleSubmit} className="login-form">
                        <FormItem validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
                            {userNameDecorator(<Input addonBefore={<Icon type="user" />} placeholder="用户名" />)}
                        </FormItem>
                        <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''} >
                            {passwordDecorator(<Input addonBefore={<Icon type="lock" />} type="password" placeholder="密码" />)}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" loading={this.state.loading} disabled={hasErrors(getFieldsError())}>登录</Button>
                        </FormItem>
                        <FormItem>
                            &nbsp;<Link to="/user/findpassword">找回密码</Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const LoginPage = Form.create()(Login);
export default LoginPage;