import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, Item, H1, Input } from 'native-base'
import BackButton from '../shared/BackButton'
import TaskItem from './_item'
import NavbarPopover from '../shared/NavbarPopover'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import Styles from '../../common/styles'

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
    handleChangeSearchKey = (key) => {
        this.props.stores.taskStore.setParams({ searchKey: key })
    }
    handleSubmitSearch = () => {
        this.refreshData()
    }
    handleSelectMenu = item => {
        this.props.navigation.setParams({ status: item.value })
        this.props.stores.taskStore.setParams({ status: item.value })
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
                <Header searchBar rounded>
                    <Item>
                        <BackButton />
                        <Input placeholder={menu.label}
                            onChangeText={this.handleChangeSearchKey}
                            onSubmitEditing={this.handleSubmitSearch}
                        />
                        <Button transparent onPress={this.handleSubmitSearch}>
                            <Icon name="search" />
                        </Button>
                        <Button transparent onPress={this.showPopover}>
                            <Icon name="bars" />
                        </Button>
                    </Item>
                </Header>
                <Content>
                    <NavbarPopover ref="menu" data={this.menuData} onSelect={this.handleSelectMenu} />
                    <FlatList
                        data={list}
                        renderItem={this.renderItem}
                        onEndReachedThreshold={0.1}
                        keyExtractor={this.keyExtractor}
                        onEndReached={this.loadNextPageData}
                        onRefresh={this.refreshData}
                        refreshing={loading}
                        style={Styles.FlatList}
                        ListEmptyComponent={<ListEmptyComponent icon="file-o" text={`暂无任务记录`} loading={loading} />}
                    />
                </Content>
            </Container>
        );
    }
}

export default TaskList;