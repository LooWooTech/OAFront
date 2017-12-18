import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { Text, StyleSheet } from 'react-native'
import { List } from 'antd-mobile'
import moment from 'moment'
class MessageItem extends Component {
    handleClick = () => {
        const { model } = this.props
    }

    render() {
        const { model } = this.props
        return (
            <List.Item onClick={this.handleClick}>
                <Text style={styles.title}>{model.Title}</Text>
                <List.Item.Brief>
                    <Text style={styles.subTitle}>来自{model.FromUser}-{model.FormName}的消息 {moment(model.CreateTime).format('ll')}</Text>
                </List.Item.Brief>
            </List.Item>
        );
    }
}
const styles = StyleSheet.create({
    title: { fontSize: 14 },
    subTitle: { fontSize: 11 },
})
export default MessageItem;