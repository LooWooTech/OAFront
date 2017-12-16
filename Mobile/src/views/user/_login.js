import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { InputItem, WhiteSpace, Button } from 'antd-mobile'
import { observer, inject } from 'mobx-react'
import { nav } from 'react-navigation' 

@inject('stores')
@observer class UserLogin extends Component {

    state = { username: '', password: '' }

    componentWillMount() {
        console.debug("props", this.props)
    }

    handleChangeName = val => this.setState({ username: val });
    handleChangePw = val => this.setState({ password: val });
    handleSubmit = () => {
        if (!this.state.username || !this.state.password) {
            return false;
        }
        this.props.stores.userStore.login(this.state.username, this.state.password)

    }

    render() {
        return (
            <View style={styles.loginPanel} >

                <InputItem ref="txtUsername" placeholder="用户名" onChange={this.handleChangeName}></InputItem>
                <InputItem type="password" placeholder="密码" onChange={this.handleChangePw}></InputItem>
                <WhiteSpace />
                <Button type="primary" style={styles.loginButton} onClick={this.handleSubmit}>{this.props.stores.userStore.inProgress ? '登陆中' : '登录'}</Button>
                <WhiteSpace />

            </View>
        );
    }
}
const styles = StyleSheet.create({
    loginPanel: { width: '90%', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingTop: 15, paddingBottom: 15, },
    loginButton: { width: '90%' }
});

export default UserLogin;