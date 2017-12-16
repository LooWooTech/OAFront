import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { observer, inject } from 'mobx-react'
import LoginForm from '../user/_login'
import { WhiteSpace } from 'antd-mobile'
import { observable } from 'mobx';

@inject('stores')
@observer
class HomeWelcome extends Component {

    render() {
        const user = this.props.stores.userStore.getUser()
        if (user) {
            setTimeout(() => {
                this.props.navigation.navigate('Home')
            }, 1000);
        }
        return (
            <View style={styles.container}>
                <Image source={require('../../resources/logo.png')} style={styles.logo} />
                <WhiteSpace size="lg" />
                <Text style={styles.title}>
                    舟山市国土局定海分局
                </Text>
                <Text style={styles.subTitle}>
                    办公自动化系统v1.0
                </Text>
                <WhiteSpace size="lg" />
                {user ? null : <LoginForm />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { height: '100%', alignItems: 'center', backgroundColor: '#108ee9' },
    logo: { marginTop: 40 },
    title: { fontSize: 20, color: '#fff' },
    subTitle: { fontSize: 12, color: '#ccc' },
});

export default HomeWelcome;