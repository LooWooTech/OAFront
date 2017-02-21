import React, { Component } from 'react'
import { Link } from 'react-router'
import { Form, Icon, Button } from 'antd'
import '../../css/login.css'

import auth from '../../models/auth'
import api from '../../models/api'
import utils from '../../utils'

export default class Login extends Component {
    state = {}
    handleSubmit = (e, {formData}) => {
        e.preventDefault()
        api.UserLogin(this, formData, json => {
            auth.login(json);
            utils.Redirect('/');
        })
    }
    render() {
        return (
            <div>
                <h2><i className="fa fa-user"></i>Log-in to your account</h2>
                <Form error={this.state.formError} warning={true} onSubmit={this.handleSubmit} size="large" className={this.state.loading ? "loading" : null}>
                    <div className="field">
                        <div className="ui left icon input">
                            <i aria-hidden="true" className="user icon"></i>
                            <input required pattern="\w{3,16}" type="text" name="name" placeholder="用户名" />
                        </div>
                    </div>
                    <div className="field">
                        <div className="ui left icon input">
                            <i aria-hidden="true" className="lock icon"></i>
                            <input type="password" name="password" required placeholder="密码" />
                        </div>
                    </div>
                    <Button fluid color="teal">登录</Button>
                </Form>
            </div>
        );
    }
}
