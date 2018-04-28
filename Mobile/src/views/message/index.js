import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions, } from 'react-native'
import { Container, View, Image, Header, Body, Left, Right, Content, Title, Badge, Icon, Segment, Button, Text, H1 } from 'native-base'
import MessageItem from './_item'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import BackButton from '../shared/BackButton'
import Styles from '../../common/styles'

@inject('stores')
@observer
class Messages extends Component {

    componentWillMount() {
        this.props.stores.messageStore.loadData(1)
    }
    loadNextPageData = () => {
        this.props.stores.messageStore.loadNextPageData()
    }
    refreshData = () => {
        this.props.stores.messageStore.refreshData()
    }
    handleClickHasRead = (hasRead) => {
        this.props.stores.messageStore.setStatus(hasRead)
        this.refreshData();
    }
    handleClickReadAll = () => {
        this.props.stores.messageStore.readAll();
    }
    handleClickItem = (data) => {
        this.props.stores.messageStore.read(data.MessageId)
        const form = this.props.stores.formStore.getForm(data.FormId)
        if (form && form.Detail) {
            this.props.navigation.navigate(form.Detail, { id: data.InfoId })
        }
    }
    keyExtractor = (item, index) => index + item.ID;
    renderItem = ({ item }) => <MessageItem data={item} onClick={this.handleClickItem} />

    render() {
        const { list, hasRead, read } = this.props.stores.messageStore
        const loading = this.props.stores.messageStore.loading
        return (
            <Container>
                <Header hasSegment={true}>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Segment>
                            <Button first active={!hasRead} onPress={() => this.handleClickHasRead(false)}>
                                <Text>未读</Text>
                            </Button>
                            <Button last active={hasRead} onPress={() => this.handleClickHasRead(true)}>
                                <Text>已读</Text>
                            </Button>
                        </Segment>
                    </Body>
                    <Right>
                        {!hasRead && list.length > 0 ? (
                            <Button onPress={this.handleClickReadAll} transparent>
                                <Icon name="bell-slash-o" />
                            </Button>
                        ) : null}
                    </Right>
                </Header>
                <Content>
                    <FlatList
                        data={list}
                        renderItem={this.renderItem}
                        onEndReachedThreshold={0.1}
                        keyExtractor={this.keyExtractor}
                        onEndReached={this.loadNextPageData}
                        onRefresh={this.refreshData}
                        refreshing={loading}
                        style={Styles.FlatList}
                        ListEmptyComponent={<ListEmptyComponent icon="bell-o" text="暂无消息" loading={loading} />}
                    />
                </Content>
            </Container>
        );
    }
}

export default Messages;