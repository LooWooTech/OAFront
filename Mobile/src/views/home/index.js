import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { WingBlank, WhiteSpace, TabBar, Grid, Popover, Icon, Button, Badge } from 'antd-mobile'
import { observer, inject } from 'mobx-react'

@inject('stores')
@observer
class HomePage extends Component {
    static navigationOptions = ({ navigation }) => {
        //console.log(navigation)
        return {
            header: null,
            // headerTitle: (
            //     <Text style={{ flex: 4, lineHeight: 40, fontSize: 18, paddingLeft: 20, color: '#fff' }}>
            //         <Icon type={'\uf2be'} color="#eee" /> 欢迎
            //     </Text>
            // ),
            // headerRight: (
            //     <TouchableOpacity style={{ margin: 10, justifyContent: 'center', width: 40 }} onPress={() => navigation.navigate('settings')}>
            //         <Icon type={'\uf013'} color="#eee" />
            //     </TouchableOpacity>
            // ),
            // headerStyle: { backgroundColor: '#108ee9' },
            tabBarLabel: '首页',
            tabBarIcon: ({ tintColor }) => (
                <Icon type={'\uf009'} color={tintColor} />
            )
        };
    }

    state = {}

    handleClickSetting = ()=>{
        this.props.navigation.navigate('Settings')
    }

    render() {
        const user = this.props.stores.userStore.user || {}
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ flex: 4, lineHeight: 40, fontSize: 18, paddingLeft: 20, color: '#fff' }}>
                        <Icon type={'\uf2be'} color="#eee" /> 欢迎您：{user.RealName}
                    </Text>
                    <TouchableOpacity style={{ margin: 10, justifyContent: 'center', width: 40 }} onPress={this.handleClickSetting}>
                        <Icon type={'\uf013'} color="#eee" />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <Text style={styles.title}>功能模块</Text>
                    <Grid data={this.props.stores.formStore.getForms()}
                        columnNum={3}
                        renderItem={form => <GridItem model={form} />}
                    />
                </ScrollView>

            </View>
        );
    }
}

class GridItem extends Component {
    handleClick = () => {
        const form = this.props.model
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
    icon: { width: 26, height: 26, },
    header: { flexDirection: 'row', justifyContent: 'space-between', height: 60, backgroundColor: '#108ee9', overflow: 'visible' },
    title: { fontSize: 14, padding: 10, backgroundColor: '#eee' },
    btnForm: { width: '100%', height: 100, alignItems: 'center', paddingTop: 20, paddingBottom: 20, }
})

export default HomePage;