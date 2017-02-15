import React, { Component } from 'react'
import { Link } from 'react-router'
import { Header, Grid, Form, Segment, Message, Icon, Button } from 'semantic-ui-react'
import './login.css'

import auth from '../../models/auth'
import utils from '../../utils'

export default class Login extends Component {
    state = { formData: {} }

    handleSubmit = (e, { formData }) => {
        e.preventDefault()
        //this.setState({ formData })
        utils.POST('/api/user/login', formData, (json) => {
            console.log(json);
            
        });
    }

    render() {
        const { formData, onSubmit } = this.state
        return (
            <Grid verticalAlign='middle' centered>
                <Grid.Column>
                    <Header as='h2' icon='user' content='Log-in to your account' color='teal' />
                    <Segment stacked>
                        <Form onSubmit={this.handleSubmit} size='large' className={onSubmit ? 'loading' : null}>
                            <Form.Input icon='user' iconPosition='left' placeholder='用户名' name='username' />
                            <Form.Input icon='lock' iconPosition='left' type='password' placeholder='密码' name='password' />
                            <Button fluid color='teal'>登录</Button>
                        </Form>
                    </Segment>
                    <Message attached='bottom' warning>
                        <Link to='/user/findpassword'>忘记密码<Icon name='help' />
                        </Link>
                    </Message>
                    <Message>
                        <pre>formData: {JSON.stringify(formData, null, 2)}</pre>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
