import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, H1 } from 'native-base'
import MissiveItem from './_item'
import missiveStore from '../../stores/missiveStore'
import Popover from '../components/Popover'
import NavbarPopover from '../shared/NavbarPopover'
import EmptyListTips from '../shared/EmptyListTips'
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
        this.props.stores.missiveStore.setParams({
            ...this.props.navigation.state.params
        })
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
    renderItem = ({ item }) => <MissiveItem model={item} />

    render() {
        const { stores, navigation } = this.props
        let { formId, status, searchKey } = navigation.state.params
        status = status || 1
        const form = stores.formStore.getForm(formId)
        const { list } = stores.missiveStore
        const statusText = this.menuData[status - 1].label
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>
                            <Icon name={form.Icon} /> {form.Name} - {statusText}
                        </Title>
                    </Body>
                    <Right>
                        <TouchableOpacity ref='button' onPress={this.showPopover}>
                            <Icon name="bars" />
                        </TouchableOpacity>
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
                        refreshing={stores.missiveStore.data.loading}
                        style={{ height: Dimensions.get('window').height - 80 }}
                        ListEmptyComponent={<EmptyListTips icon="file-o" text={`暂无${statusText}`} />}
                    />
                </Content>
                <NavbarPopover ref="menu" data={this.menuData} onSelect={this.handleSelectStatus} />
            </Container>
        );
    }
}

export default MissiveList;