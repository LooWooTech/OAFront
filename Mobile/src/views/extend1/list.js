import React, { Component } from 'react';
import { FlatList, Dimensions } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Container, Header, Left, Body, Right, Title, Segment, View, Content, Text, Button, } from 'native-base'
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import FormExtend1Item from './_item'

@inject('stores')
@observer
class FormExtend1List extends Component {

    componentWillMount() {
        console.log(this.props.navigation.state.params)
        this.props.stores.extend1Store.setParams(this.props.navigation.state.params)
        this.props.stores.extend1Store.refreshData()
    }

    loadNextPageData = () => {
        this.props.stores.extend1Store.loadNextPageData()
    }
    refreshData = () => {
        this.props.stores.extend1Store.refreshData()
    }

    handleChangeStatus = status => {
        this.props.stores.extend1Store.setParams({ status })
        this.refreshData()
    }

    keyExtractor = (item, index) => item.ID;

    handleClickItem = (item) => {
        //this.props.navigation.navigate('.Detail', { id: item.InfoId })
    }
    renderItem = ({ item }) => <FormExtend1Item model={item} onClick={this.handleClickItem} />

    render() {
        const { list, loading, params } = this.props.stores.extend1Store
        const hasSegment = !this.props.stores.userStore.isCurrentUser(params.userId)
        const form = this.props.stores.formStore.getForm(params.formId)

        return (
            <Container>
                <Header hasSegment={hasSegment}>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        {hasSegment ?
                            <Segment>
                                <Button first active={!params.status} onPress={() => this.handleChangeStatus(0)}>
                                    <Text>全部</Text>
                                </Button>
                                <Button active={params.status === 1} onPress={() => this.handleChangeStatus(1)}>
                                    <Text>未审</Text>
                                </Button>
                                <Button last active={params.status === 2} onPress={() => this.handleChangeStatus(2)}>
                                    <Text>已审</Text>
                                </Button>
                            </Segment>
                            :
                            <Title>我的{form.Name}</Title>
                        }
                    </Body>
                    <Right></Right>
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