import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Segment, Button, List, ListItem, Item, H1, Input } from 'native-base'
import BackButton from '../shared/BackButton'
import GoodsApplyItem from './_apply_item'
import NavbarPopover from '../shared/NavbarPopover'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import Styles from '../../common/styles'

@inject('stores')
@observer
class GoodsApplyList extends Component {

    componentWillMount() {
        let { applyUserId, approvalUserId, status } = this.props.navigation.state.params
        this.props.stores.goodsApplyStore.setParams({
            applyUserId: applyUserId || 0,
            approvalUserId: approvalUserId || 0,
            status: status || 0
        })
        this.props.stores.goodsApplyStore.refreshData()
    }
    handleChangeStatus = status => {
        this.props.stores.goodsApplyStore.setParams({ status });
        this.refreshData();
    }
    loadNextPageData = () => {
        this.props.stores.goodsApplyStore.loadNextPageData()
    }
    refreshData = () => {
        this.props.stores.goodsApplyStore.refreshData()
    }
    keyExtractor = (item, index) => item.ID;

    handleClickItem = (item) => {
        if (item.Result === null &&
            this.props.stores.userStore.isCurrentUser(item.ApprovalUserId)) {
            this.props.navigation.navigate('Goods.Approval', { model: item })
        }
    }
    renderItem = ({ item }) => <GoodsApplyItem model={item} onClick={this.handleClickItem} />

    render() {
        const { list, params, loading } = this.props.stores.goodsApplyStore
        return (
            <Container>
                <Header hasSegment={true}>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Segment>
                            <Button first active={params.status === 0} onPress={() => this.handleChangeStatus(0)}>
                                <Text>全部</Text>
                            </Button>
                            <Button active={params.status === 1} onPress={() => this.handleChangeStatus(1)}>
                                <Text>未审</Text>
                            </Button>
                            <Button last active={params.status === 2} onPress={() => this.handleChangeStatus(2)}>
                                <Text>已审</Text>
                            </Button>
                        </Segment>
                    </Body>
                    <Right>
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
                        ListEmptyComponent={<ListEmptyComponent icon="file-o" text={`暂无申请记录`} loading={loading} />}
                    />
                </Content>
            </Container>
        );
    }
}

export default GoodsApplyList;