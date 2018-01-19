import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, H1 } from 'native-base'
import TaskItem from './_item'
import NavbarPopover from '../shared/NavbarPopover'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import { FORMS } from '../../common/config'

@inject('stores')
@observer
class TaskList extends Component {
    menuData = [
        { label: '待办任务', value: 1, icon: 'envelope-open-o' },
        { label: '已办任务', value: 2, icon: 'check-square-o' },
        { label: '完成任务', value: 3, icon: 'archive' },
        { label: '所有任务', value: '', icon: 'list' },
    ]
    showPopover = () => {
        this.refs.menu.show();
    }
    handleSelectStatus = val => {
        this.props.navigation.setParams({ status: val })
        this.props.stores.taskStore.setParams({ status: val })
        this.refs.menu.hide();
        this.refreshData()
    }
    componentWillMount() {
        this.props.stores.taskStore.setParams(this.props.navigation.state.params)
        this.props.stores.taskStore.refreshData()
    }
    loadNextPageData = () => {
        this.props.stores.taskStore.loadNextPageData()
    }
    refreshData = () => {
        this.props.stores.taskStore.refreshData()
    }
    keyExtractor = (item, index) => item.ID;
    handleClickItem = (item) => {
        this.props.navigation.navigate('Task.Detail', { id: item.ID })
    }
    renderItem = ({ item }) => <TaskItem model={item} onClick={this.handleClickItem} />

    render() {
        const { stores, navigation } = this.props
        let { status, searchKey } = navigation.state.params
        const { list } = stores.taskStore
        const menu = this.menuData.find(e => e.value == status)
        const loading = stores.taskStore.loading
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>
                            <Icon name={menu.icon} /> {menu.label}
                        </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.showPopover}>
                            <Icon name="bars" />
                        </Button>
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
                        style={{ height: Dimensions.get('window').height - 80, backgroundColor: '#fff' }}
                        ListEmptyComponent={<ListEmptyComponent icon="file-o" text={`暂无任务记录`} loading={loading} />}
                    />
                </Content>
                <NavbarPopover ref="menu" data={this.menuData} onSelect={this.handleSelectStatus} />
            </Container>
        );
    }
}

export default TaskList;