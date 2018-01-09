import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, H1 } from 'native-base'
import MissiveItem from './_item'
import missiveStore from '../../stores/missiveStore'
import Popover from '../components/Popover'
import NavbarPopover from '../shared/NavbarPopover'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import $ from '../../common/utils'

@inject('stores')
@observer
class MissiveList extends Component {

    menuData = [
        { label: '待办件', value: 1, icon: 'envelope-open-o' },
        { label: '已办件', value: 2, icon: 'check-square-o' },
        { label: '完结件', value: 3, icon: 'archive' },
        { label: '退回件', value: 4, icon: 'reply' },
    ]

    state = { isVisible: false, buttonRect: {} }

    showPopover = () => {
        this.refs.menu.show();
    }

    handleSelectStatus = val => {
        this.props.navigation.setParams({ status: val })
        this.props.stores.missiveStore.setParams({ status: val })
        this.refs.menu.hide();
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

    keyExtractor = (item, index) => item.ID;

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
                <Header>
                    <Body>
                        <Title>
                            <Icon name={form.Icon} /> {form.Name} - {statusText}
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
                        ListEmptyComponent={<ListEmptyComponent icon="file-o" text={`暂无${statusText}`} loading={loading} />}
                    />
                </Content>
                <NavbarPopover ref="menu" data={this.menuData} onSelect={this.handleSelectStatus} />
            </Container>
        );
    }
}

export default MissiveList;