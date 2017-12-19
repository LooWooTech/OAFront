import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { Text, StyleSheet } from 'react-native'
import { List, Icon } from 'antd-mobile'
import moment from 'moment'

@inject('stores')
class MessageItem extends Component {
    handleClick = () => {
        const { model } = this.props
    }

    render() {
        const { model } = this.props
        const form = this.props.stores.formStore.getForm(model.FormId)
        return (
            <List.Item
                thumb={<Text style={{ padding: 10 }}><Icon type={form.Icon} color={form.Color || '#666'} /></Text>}
                onClick={this.handleClick}
                arrow="horizontal" multipleLine
            >
                <Text style={styles.title}>{model.Title}</Text>
                <List.Item.Brief>
                    <Text style={styles.subTitle}>{model.FromUser} {moment(model.CreateTime).format('ll')}</Text>
                </List.Item.Brief>
            </List.Item>
        );
    }
}
const styles = StyleSheet.create({
    title: { fontSize: 15, lineHeight: 25 },
    subTitle: { fontSize: 11, lineHeight: 20 },
})
export default MessageItem;