import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Image, Text, View, } from 'react-native'
import { Badge, Icon, SegmentedControl, Button } from 'antd-mobile'
import MessageItem from './_item'
import messageStore from '../../stores/messageStore'

@inject('stores')
@observer
class Messages extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: (
            <SegmentedControl
                style={{ marginLeft: 10, marginRight: 10 }}
                values={['未读', '已读']}
                onChange={(e) => {
                    const hasRead = e.nativeEvent.selectedSegmentIndex !== 0
                    messageStore.setStatus(hasRead)
                    messageStore.refreshData()
                }} />
        ),
        tabBarLabel: '消息',
        tabBarIcon: ({ tintColor }) => (
            <Badge dot={messageStore.list.find(e => !e.HasRead)}>
                <Icon type={'\uf0a2'} color={tintColor} />
            </Badge>
        )
    });

    rowHeight = 80

    componentWillMount() {
        this.loadData(1)
    }
    loadData = (page) => {
        this.props.stores.messageStore.loadData(page)
    }
    loadNextPageData = () => {
        const page = this.props.stores.messageStore.page + 1
        this.loadData(page)
    }
    refreshData = () => {
        this.props.stores.messageStore.refreshData()
    }
    handleReadAll = ()=>{
        this.props.stores.messageStore.readAll();
    }

    getItemLayout = (data, index) => ({ length: this.rowHeight, offset: this.rowHeight * index, index })
    keyExtractor = (item, index) => item.ID;
    renderItem = ({ item }) => <MessageItem model={item} />
    
    render() {

        const list = this.props.stores.messageStore.list
        const hasRead = this.props.stores.messageStore.hasRead
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <FlatList
                    ref="list"
                    data={list}
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.1}
                    keyExtractor={this.keyExtractor}
                    onEndReached={this.loadNextPageData}
                    onRefresh={this.refreshData}
                    refreshing={false}
                    getItemLayout={this.getItemLayout}
                    ListEmptyComponent={(
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 50 }}>
                            <Icon type={'\uf0a2'} size="lg" color="#ccc" />
                            <Text style={{ lineHeight: 30 }}>暂无新的消息</Text>
                        </View>
                    )}
                />
                {!hasRead ? <Button onClick={this.handleReadAll}><Icon type={'\uf1f7'} size="sm" color="#666"/><Text style={{ fontSize: 14, color: '#666' }}>全部标记为已读</Text></Button> : null}
            </View>
        );
    }
}

export default Messages;