import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { WingBlank, WhiteSpace, Grid, Popover, Icon, Button, Badge } from 'antd-mobile'
import { observer, inject } from 'mobx-react'
import UnreadMessages from '../message/unreads'

@inject('stores')
@observer
class HomePage extends Component {

    static navigationOptions = ({
        header: null
    });

    handleClickBell = () => {
        this.props.navigation.navigate('MessageList')
    }

    handleClickSetting = () => {

    }

    render() {
        const user = this.props.stores.userStore.user
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ flex: 4, lineHeight:40, fontSize: 18, paddingLeft: 20, color: '#fff' }}>
                        <Icon type={'\uf2be'} color="#eee" /> 欢迎您：{user.RealName}
                    </Text>
                    <TouchableOpacity style={{ margin: 10, justifyContent: 'center', width: 40 }} onPress={this.handleClickBell}>
                        <Badge dot={this.props.stores.messageStore.unreads.length > 0}>
                            <Icon type={'\uf0a2'} color="#eee" />
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ margin: 10, justifyContent: 'center', width: 40 }} onPress={this.handleClickSetting}>
                        <Icon type={'\uf013'} color="#eee" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1 }}>
                    <View style={{ backgroundColor: '#fff' }}>
                        <Text style={styles.title}>业务类型</Text>
                        <Grid data={this.props.stores.formStore.getForms()}
                            columnNum={3}
                            renderItem={form => <GridItem model={form} />}
                        />
                    </View>
                    <View>
                        <Text style={styles.title}>最新消息</Text>
                        <UnreadMessages />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

class GridItem extends Component {
    handleClick = () => {
        const form = this.props.model
        console.log(form)
    }
    render() {
        const form = this.props.model
        return (
            <TouchableOpacity onPress={this.handleClick}>
                <View style={styles.btnForm}>
                    <Icon type={form.Icon} color={form.Color || '#666'} />
                    <Text style={{ lineHeight: 30 }}>{form.Name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', height: 60, backgroundColor: '#108ee9', overflow: 'visible' },
    title: { fontSize: 14, padding: 10, backgroundColor: '#eee' },
    btnForm: { width: '100%', height: 100, alignItems: 'center', paddingTop: 20, paddingBottom: 20, }
})

export default HomePage;