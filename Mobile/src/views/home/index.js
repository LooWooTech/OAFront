import React, { Component } from 'react';
import { BackHandler, Image, Keyboard, Linking, Alert, Platform } from 'react-native';
import { observer, inject } from 'mobx-react'
import { NavigationActions } from 'react-navigation'
import { Container, Header, Text, View, Left, Body, Content, Title, Right, Icon, List, ListItem, Button } from 'native-base'
import HomeFormGrid from './_formGrid'
import { BANNER_URL } from '../../common/config';
import moment from 'moment'

@inject('stores')
@observer
class HomePage extends Component {

    componentWillMount() {
        Keyboard.dismiss()
        if (Platform.OS == 'android' && this.props.stores.clientStore.shouldUpgrade) {
            Alert.alert('提醒', '有最新的版本，请升级', [
                {
                    text: '确定', onPress: () => {
                        const downloadUrl = this.props.stores.clientStore.getDownloadUrl();
                        Linking.openURL(downloadUrl).catch(err => console.error(err))
                    }
                }, {
                    text: '取消',
                    onPress: () => { }
                }
            ])
        }
    }

    handleClickMessage = () => {
        this.props.navigation.navigate('Messages')
    }

    handleClickSetting = () => {
        this.props.navigation.navigate('Settings')
    }

    handleClickForm = (form) => {
        this.props.navigation.navigate(form.Home, { formId: form.ID, ...form.Params })
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
                        <Button transparent onPress={this.handleClickMessage}>
                            <Icon name="bell-o" style={{ color: '#fff' }} />
                        </Button>
                        <Button transparent onPress={this.handleClickSetting}>
                            <Icon name="gear" style={{ color: '#fff' }} />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: '#fff' }}>
                    <Image source={{ uri: BANNER_URL + "?v=" + moment().format('ll') }} style={{ height: 195, width: '100%' }} />
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