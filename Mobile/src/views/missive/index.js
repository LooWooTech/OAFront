import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, Item, H1, Input } from 'native-base'
import MissiveItem from './_item'
import BackButton from '../shared/BackButton'
import NavbarPopover from '../shared/NavbarPopover'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import Styles from '../../common/styles'

@inject('stores')
@observer
class MissiveList extends Component {

    menuData = [
        { label: '待办件', value: 1, icon: 'envelope-open-o' },
        { label: '已办件', value: 2, icon: 'check-square-o' },
        { label: '完结件', value: 3, icon: 'archive' },
        { label: '退回件', value: 4, icon: 'reply' },
    ]

    showPopover = () => {
        this.refs.menu.show();
    }

    handleSelectMenu = item => {
        console.log(item)
        this.props.navigation.setParams({ status: item.value })
        this.props.stores.missiveStore.setParams({ status: item.value })
        this.refreshData()
    }

    componentWillMount() {
        this.props.stores.missiveStore.setParams(this.props.navigation.state.params)
        this.props.stores.missiveStore.refreshData()
    }
    loadNextPageData = () => {
        this.props.stores.missiveStore.loadNextPageData()
    }
    refreshData = () => {
        this.props.stores.missiveStore.refreshData()
    }

    handleChangeSearchKey = (key) => {
        this.props.stores.missiveStore.setParams({ searchKey: key })
    }
    handleSubmitSearch = () => {
        this.refreshData()
    }

    keyExtractor = (item, index) => item.ID + index;
    handleClickItem = (item) => {
        this.props.navigation.navigate('Missive.Detail', { id: item.InfoId })
    }
    renderItem = ({ item }) => <MissiveItem model={item} onClick={this.handleClickItem} />

    render() {
        const { stores, navigation } = this.props
        let { formId, status, searchKey } = navigation.state.params
        status = status || 1
        const form = stores.formStore.getForm(formId)
        const { list } = stores.missiveStore
        const statusText = this.menuData[status - 1].label
        const loading = stores.missiveStore.loading
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <BackButton />
                        <Input placeholder={`${form.Name} - ${statusText}`}
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
                        ListEmptyComponent={<ListEmptyComponent icon="file-o" text={`暂无${statusText}`} loading={loading} />}
                    />
                </Content>
            </Container>
        );
    }
}

export default MissiveList;