import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native'
import { WhiteSpace, WingBlank, List, Button, Switch } from 'antd-mobile'
import { observer,inject } from 'mobx-react'

@inject('stores')
@observer
class Settings extends Component {
    static navigationOptions = ({
        title: '软件设置'
    });

    handleClickLogout = () => {
        this.props.stores.userStore.logout()
        this.props.navigation.navigate('Welcome')
    }

    render() {
        return (
            <ScrollView style={{ paddingTop: 10 }}>
                <WingBlank>
                    <List renderHeader={() => "系统设置"}>
                        <List.Item
                            extra={<Switch checked={true} disabled={true} />}
                        >
                            <Text>接收通知</Text>
                        </List.Item>
                    </List>
                </WingBlank>
                <WhiteSpace size="lg" />
                <WingBlank>
                    <Button onClick={this.handleClickLogout}>退出登录</Button>
                </WingBlank>
            </ScrollView>
        );
    }
}

export default Settings;