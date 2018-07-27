import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, Item, H1, Input } from 'native-base'
import BackButton from '../shared/BackButton'
import GoodsItem from './_item'
import NavbarPopover from '../shared/NavbarPopover'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import Styles from '../../common/styles'
import { FORMS } from '../../common/config';

@inject('stores')
@observer
class GoodsList extends Component {
    menuData = [
        {
            icon: 'list',
            label: '物品分类',
            value: 'Category.List',
            params: {
                formId: FORMS.Goods.ID,
                onSelect: (categoryId) => {
                    this.props.stores.goodsStore.setParams({ categoryId });
                    this.refreshData();
                }
            },
        },
        { label: '我的申请', value: 'Goods.ApplyList', icon: 'history', params: { applyUserId: this.props.stores.userStore.user.ID } },
        { label: '我的审核', value: 'Goods.ApplyList', icon: 'check', params: { approvalUserId: this.props.stores.userStore.user.ID } },
    ]
    showPopover = () => {
        this.refs.menu.show();
    }

    handleChangeSearchKey = (key) => {
        this.props.stores.goodsStore.setParams({ searchKey: key })
    }
    handleSubmitSearch = () => {
        this.refreshData()
    }
    handleSelectMenu = item => {
        this.props.navigation.navigate(item.value, item.params || {});
    }
    componentWillMount() {
        this.props.stores.goodsStore.setParams(this.props.navigation.state.params)
        this.props.stores.goodsStore.refreshData()
    }
    loadNextPageData = () => {
        this.props.stores.goodsStore.loadNextPageData()
    }
    refreshData = () => {
        this.props.stores.goodsStore.refreshData()
    }
    keyExtractor = (item) => item.ID;

    handleClickItem = (item) => {
        this.props.navigation.navigate('Goods.Detail', { model: item })
    }
    renderItem = ({ item }) => <GoodsItem model={item} onClick={this.handleClickItem} />

    render() {
        const { list, loading, params } = this.props.stores.goodsStore
        const category = this.props.stores.categoryStore.getModel(params.categoryId)
        const categoryName = params.categoryId ? '-' + category.Name : ''
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <BackButton />
                        <Input placeholder={`物品列表${categoryName}`}
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
                        ListEmptyComponent={<ListEmptyComponent icon="file-o" text={`尚未添加任何物品`} loading={loading} />}
                    />
                </Content>
            </Container>
        );
    }
}

export default GoodsList;