import React, { Component } from 'react'
import { Link } from 'react-router'
import { Header, Grid, Form, Segment, Message, Icon, Button } from 'semantic-ui-react'
import '../../css/login.css'

import auth from '../../models/auth'
import api from '../../models/api'
import utils from '../../utils'

export default class Login extends Component {
    state = {}
    handleSubmit = (e, form) => {
        e.preventDefault()
        api.UserLogin(this, form.formData, json => {
            auth.login(json);
            utils.Redirect('/');
            //window.locaiton.href = '/';
        })
    }
    render() {
        return (
            <Grid verticalAlign="middle" centered>
                <Grid.Column>
                    <Header as="h2" icon="user" content="Log-in to your account" color="teal" />
                    <Segment stacked>
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
                    </Segment>
                    <Message attached="bottom" warning>
                        <Link to="/user/findpassword">忘记密码<Icon name="help" />
                        </Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
