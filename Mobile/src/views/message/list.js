import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList } from 'react-native'
import MessageItem from './_item'

@inject('stores')
@observer
class MessageList extends Component {

    pageSize = 10;
    pageIndex = 1;

    componentWillMount() {
        pageIndex = 1
        this.loadData(this.pageIndex)
    }

    loadData = (page) => {
        this.props.stores.messageStore.getMessages(null, page, this.pageSize)
    }

    render() {
        return (
            <FlatList />
            
        );
    }
}

export default MessageList;