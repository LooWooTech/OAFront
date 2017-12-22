import React, { Component } from 'react';
import { BackHandler, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { observer, inject } from 'mobx-react'
import { NavigationActions } from 'react-navigation'
import { Container, Header, Text, View, Left, Body, Content, Title, Right, Icon, List, ListItem } from 'native-base'
import HomeFormGrid from './_formGrid'

@inject('stores')
@observer
class HomePage extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null,
            tabBarLabel: '首页',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="th" style={{ fontSize: 25, color: tintColor }} />
            )
        };
    }

    handleClickSetting = () => {
        this.props.navigation.navigate('Settings')
    }

    handleClickForm = (form) => {
        const action = NavigationActions.navigate({
            routeName: form.List,
            params: { formId: form.ID, ...form.Params }
        })
        this.props.navigation.dispatch(action)
    }

    render() {
        const user = this.props.stores.userStore.user || {}
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>
                            <Icon name="user-circle" style={{ color: '#fff' }} /> 欢迎您：{user.RealName}
                        </Title>
                    </Body>
                    <Right>
                        <TouchableOpacity onPress={this.handleClickSetting}>
                            <Icon name="gear" style={{ color: '#fff' }} />
                        </TouchableOpacity>
                    </Right>
                </Header>
                <Content>
                    <Image source={require('../../resources/banner.png')} style={{ height: 170, width: '100%' }} />
                    <List>
                        <ListItem itemDivider >
                            <Text>功能模块</Text>
                        </ListItem>
                        <ListItem last>
                            <HomeFormGrid onClick={this.handleClickForm} />
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}
export default HomePage;