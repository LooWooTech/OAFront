import React, { Component } from 'react';
import { FlatList, Dimensions } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Container, Header, Left, Body, Right, Title, Segment, Tab, TabHeading, Tabs, View, Content, Text, Button, } from 'native-base'
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import FormExtend1Item from './_item'

@inject('stores')
@observer
class FormExtend1List extends Component {

    componentWillMount() {
        this.props.stores.extend1Store.setParams(this.props.navigation.state.params)
        this.props.stores.extend1Store.refreshData()
    }

    loadNextPageData = () => {
        this.props.stores.extend1Store.loadNextPageData()
    }
    refreshData = () => {
        this.props.stores.extend1Store.refreshData()
    }

    keyExtractor = (item, index) => item.ID;

    handleClickItem = (item) => {
        //this.props.navigation.navigate('.Detail', { id: item.InfoId })
    }
    renderItem = ({ item }) => <FormExtend1Item model={item} onClick={this.handleClickItem} />

    render() {
        const params = this.props.navigation.state.params
        const isMyList = this.props.stores.userStore.isCurrentUser(params.userId)
        const form = this.props.stores.formStore.getForm(params.formId)
        const { list, loading } = this.props.stores.extend1Store
        return (
            <Container>
                <Header hasSegment={!isMyList}>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>{isMyList ? `我的${form.Name}` : `${form.Name}审批`}</Title>
                    </Body>
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
                        ListEmptyComponent={<ListEmptyComponent icon="file-o" text={`暂无${form.Name}记录`} loading={loading} />}
                    />
                </Content>
            </Container>
        );
    }
}

export default FormExtend1List;