import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import { StyleSheet, Image } from 'react-native';
import { observer, inject } from 'mobx-react'
import { Container, Content, Text, View } from 'native-base'
import CounterDown from '../shared/CounterDown'
import LoginForm from '../user/_login'

@inject('stores')
@observer
class Welcome extends Component {
    static navigationOptions = {
        header: null
    }

    render() {

        const { hasLogin, inProgress } = this.props.stores.userStore
        setTimeout(() => {
            if (hasLogin) {
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
            <Container style={{ alignItems: 'center', backgroundColor: '#108ee9' }}>
                <Image source={require('../../resources/logo.png')} style={{ marginTop: 40, marginBottom: 10 }} />
                <Text style={styles.title}>
                    舟山市国土局定海分局
                </Text>
                <Text style={styles.subTitle}>
                    办公自动化系统v1.0
                </Text>
                <LoginForm />
            </Container>
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