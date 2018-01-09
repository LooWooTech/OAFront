import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions, } from 'react-native'
import { Container, View, Image, Header, Body, Left, Right, Content, Title, Badge, Icon, Segment, Button, Text, H1 } from 'native-base'
import MessageItem from './_item'
import ListEmptyComponent from '../shared/ListEmptyComponent'

@inject('stores')
@observer
class Messages extends Component {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '消息',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="bell-o" style={{ color: tintColor, fontSize: 25 }} />
        )
    });

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
    keyExtractor = (item, index) => item.ID;
    renderItem = ({ item }) => <MessageItem data={item} />

    render() {
        const { list, hasRead, read } = this.props.stores.messageStore
        const loading = this.props.stores.messageStore.loading
        return (
            <Container>
                <Header hasSegment={true}>
                    <Segment>
                        <Button first active={!hasRead} onPress={() => this.handleClickHasRead(false)}>
                            <Text>未读</Text>
                        </Button>
                        <Button last active={hasRead} onPress={() => this.handleClickHasRead(true)}>
                            <Text>已读</Text>
                        </Button>
                    </Segment>
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
                        style={{ height: Dimensions.get('window').height - 140, backgroundColor: '#fff' }}
                        ListEmptyComponent={<ListEmptyComponent icon="bell-o" text="暂无消息" loading={loading} />}
                    />
                    {!hasRead && list.length > 0 ? (
                        <Button onPress={this.handleClickReadAll} transparent full>
                            <Icon name="bell-slash-o" style={{ color: "#666" }} />
                            <Text style={{ fontSize: 14, color: '#666' }}>全部标记为已读</Text>
                        </Button>
                    ) : null}
                </Content>
            </Container>
        );
    }
}

export default Messages;