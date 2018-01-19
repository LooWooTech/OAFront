import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Container, Content, Text, View, Form, Item, Button, Label, Input } from 'native-base'
import { observer, inject } from 'mobx-react'
import { nav } from 'react-navigation'

@inject('stores')
@observer
class UserLogin extends Component {

    state = { username: '', password: '' }
    handleChangeName = val => this.setState({ username: val });
    handleChangePw = val => this.setState({ password: val });
    handleSubmit = () => {
        if (!this.state.username || !this.state.password) {
            return false;
        }
        this.props.stores.userStore.login(this.state.username, this.state.password)
    }

    render() {
        if (!this.props.stores.userStore.hasLogin) {
            return <View style={{ borderRadius: 5, backgroundColor: '#fff', width: '90%', padding: 10, marginTop: 10 }}>
                <Form style={{ paddingTop: 5, paddingBottom: 5 }}>
                    <Item inlineLabel>
                        <Label>用户名</Label>
                        <Input onChangeText={this.handleChangeName} />
                    </Item>
                    <Item inlineLabel>
                        <Label>密&nbsp;&nbsp;&nbsp;&nbsp;码</Label>
                        <Input secureTextEntry={true} onChangeText={this.handleChangePw} />
                    </Item>
                </Form>

                <Button block onPress={this.handleSubmit} style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 17 }}>{this.props.stores.userStore.inProgress ? '登陆中' : '登录'}</Text>
                </Button>
            </View>
        }
        return null;
    }
}

export default UserLogin;