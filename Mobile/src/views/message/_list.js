import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { View, Text, StyleSheet } from 'react-native'
import { List, Icon } from 'antd-mobile'
import MessageItem from './_item'

class MessageList extends Component {
    render() {
        const list = this.props.list || []
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

export default MessageList;