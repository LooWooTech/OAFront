import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { View, Text, StyleSheet } from 'react-native'
import { List, Icon } from 'antd-mobile'
import MessageItem from './_item'

@inject('stores')
@observer
class UnreadMessageList extends Component {

    timerId = null
    componentWillMount() {
        this.timer();
        timerId = setInterval(this.timer, 1000 * 60);
    }
    componentWillUnmount() {
        clearInterval(timerId)
    }

    timer = () => {
        this.props.stores.messageStore.getUnreads(5);
    }

    render() {
        const list = (this.props.stores.messageStore.unreads || {}).List || []
        if (list.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Icon type={'\uf0a2'} size="lg" color="#ccc" />
                    <Text style={{ lineHeight: 30 }}>暂无新的消息</Text>
                </View>
            )
        }
        return (
            <List>
                {list.map(item => <MessageItem model={item} key={item.ID} />)}
            </List>
        );
    }
}

const styles = StyleSheet.create({
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 50 },
})
export default UnreadMessageList;