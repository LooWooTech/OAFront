import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions, } from 'react-native'
import { Container, View, Image, Header, Body, Left, Right, Content, Title, Badge, Icon, Segment, Button, Text, H1 } from 'native-base'
import MessageItem from './_item'
import messageStore from '../../stores/messageStore'

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
    keyExtractor = (item, index) => item.ID;
    renderItem = ({ item }) => <MessageItem model={item} />

    render() {
        const { list, hasRead, readAll, read } = this.props.stores.messageStore
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
                        ref="list"
                        data={list}
                        renderItem={this.renderItem}
                        onEndReachedThreshold={0.1}
                        keyExtractor={this.keyExtractor}
                        onEndReached={this.loadNextPageData}
                        onRefresh={this.refreshData}
                        refreshing={this.props.stores.messageStore.data.loading}
                        style={{ height: Dimensions.get('window').height - 140 }}
                        getItemLayout={this.getItemLayout}
                        ListEmptyComponent={(
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 50 }}>
                                <Icon name="bell-o" style={{ fontSize: 60, color: '#999' }} />
                                <Text style={{ lineHeight: 30, color: '#999' }}>暂无新的消息</Text>
                            </View>
                        )}
                    />
                    {!hasRead && list.length > 0 ? <Button onPress={readAll}><Icon type={'\uf1f7'} size="sm" color="#666" /><Text style={{ fontSize: 14, color: '#666' }}>全部标记为已读</Text></Button> : null}
                </Content>
            </Container>
        );
    }
}

export default Messages;