import React, { Component } from 'react';
import { BackHandler, Image, Keyboard, Linking, Alert } from 'react-native';
import { observer, inject } from 'mobx-react'
import { NavigationActions } from 'react-navigation'
import { Container, Header, Text, View, Left, Body, Content, Title, Right, Icon, List, ListItem, Button } from 'native-base'
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
    componentWillMount() {
        Keyboard.dismiss()
        if (this.props.stores.clientStore.shouldUpgrade) {
            Alert.alert('提醒', '有最新的版本，请升级', [
                {
                    text: '确定', onPress: () => {
                        const downloadUrl = this.props.stores.clientStore.getDownloadUrl();
                        Linking.openURL(downloadUrl).catch(err => console.error(err))
                    }
                }
            ])
        }
    }

    handleClickSetting = () => {
        this.props.navigation.navigate('Settings')
    }

    handleClickForm = (form) => {
        this.props.navigation.navigate(form.List, { formId: form.ID, ...form.Params })
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
                        <Button transparent onPress={this.handleClickSetting}>
                            <Icon name="gear" style={{ color: '#fff' }} />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: '#fff' }}>
                    <Image source={require('../../resources/banner.jpg')} style={{ height: 195, width: '100%' }} />
                    <List>
                        <ListItem itemDivider >
                            <Text>功能模块</Text>
                        </ListItem>
                    </List>
                    <HomeFormGrid onClick={this.handleClickForm} />
                </Content>
            </Container>
        );
    }
}
export default HomePage;