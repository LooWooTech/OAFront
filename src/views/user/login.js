import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd';
import auth from '../../models/auth'
import api from '../../models/api'
import utils from '../../utils'
const FormItem = Form.Item;

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
                }, (err) => {
                    message.error(err.Message)
                    this.setState({ loading: false });
                })
            } else {
                this.setState({ loading: false });
            }
        });
    }
    render() {
        const { getFieldDecorator} = this.props.form;

        return (
            <div className="container login-page">
                <div className="login">
                <h1>舟山市国土局定海分局
                <span>办公自动化系统</span>
                </h1>
                <Form onSubmit={this.handleSubmit}>                  
                      <FormItem>
                        {getFieldDecorator('userName', {
                          rules: [{  required: true, message: '请输入账户名！', }],
                        })(
                          <Input
                            size="large"
                            prefix={<Icon type="user" />}
                            placeholder="用户名"
                          />
                        )}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('password', {
                          rules: [{
                            required: true, message: '请输入密码！',
                          }],
                        })(
                          <Input
                            size="large"
                            prefix={<Icon type="lock" />}
                            type="password"
                            placeholder="密码"
                          />
                        )}
                      </FormItem>
                    
                  <FormItem className="additional">
                    <Button size="large" loading={this.state.loading} type="primary" htmlType="submit">
                      登录
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </div>
        );
    }
}

const LoginPage = Form.create()(Login);
export default LoginPage;