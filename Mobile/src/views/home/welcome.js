import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import { StyleSheet, Text, View, Image } from 'react-native';
import { WhiteSpace } from 'antd-mobile'
import { observer, inject } from 'mobx-react'
import LoginForm from '../user/_login'
import { observable } from 'mobx';

@inject('stores')
@observer
class Welcome extends Component {
    static navigationOptions = {
        header: null
    }

    render() {
        setTimeout(() => {
            if (this.props.stores.userStore.hasLogin) {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Index' })
                    ]
                })
                this.props.navigation.dispatch(resetAction);
            }
        }, 1000);
        return (
            <View style={styles.container} >
                <Image source={require('../../resources/logo.png')} style={styles.logo} />
                <WhiteSpace size="lg" />
                <Text style={styles.title}>
                    舟山市国土局定海分局
                </Text>
                <Text style={styles.subTitle}>
                    办公自动化系统v1.0
                </Text>
                <WhiteSpace size="lg" />
                {this.props.stores.userStore.hasLogin ? null : <LoginForm />}
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

export default Welcome;