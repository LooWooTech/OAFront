import React, { Component } from 'react';
import { Alert, Linking, IntentAndroid } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Toast, Container, Header, Text, View, Left, Body, Content, Title, Right, Icon, List, ListItem, Button } from 'native-base'
import BackButton from '../shared/BackButton'

@inject('stores')
@observer
class Settings extends Component {


    componentWillMount() {
        this.props.stores.clientStore.checkVersion();
    }

    handleLogout = () => {
        this.props.stores.userStore.logout()
        this.props.navigation.navigate('Welcome')
    }

    handleUpgrade = () => {
        const downloadUrl = this.props.stores.clientStore.getDownloadUrl();
        Linking.openURL(downloadUrl).catch(err => console.error(err))
    }

    render() {
        const { lastVersion, currentVersion, shouldUpgrade } = this.props.stores.clientStore
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>
                            系统设置
                        </Title>
                    </Body>
                </Header>
                <Content>
                    <List>
                        <ListItem>
                            <Body>
                                <Text>当前版本{!shouldUpgrade ? "（最新版）" : null}</Text>
                            </Body>
                            <Right>
                                <Text note>v{currentVersion}</Text>
                            </Right>
                        </ListItem>
                        {shouldUpgrade ?
                            <ListItem onPress={this.handleUpgrade}>
                                <Body>
                                    <Text>最新版本（点击升级）</Text>
                                </Body>
                                <Right>
                                    <Text note>v{lastVersion}</Text>
                                </Right>
                            </ListItem>
                            : null}
                    </List>
                    <View style={{ margin: 10 }}>
                        <Button danger full onPress={this.handleLogout}>
                            <Text>退出系统</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Settings;