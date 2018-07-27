import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { Alert } from 'react-native'
import { Container, Header, Left, Body, Title, Content, View, Text, Button, Toast, Footer, Row, Icon } from 'native-base'
import BackButton from '../shared/BackButton'
import Detail from '../shared/Detail'

@inject('stores')
@observer
class GoodsDetail extends Component {

    handleApplyClick = () => {
        const model = this.props.navigation.state.params.model
        this.props.navigation.navigate('Goods.Apply', { model })
    }

    getItems = (model) => {
        let items = [
            { title: '物品名称', name: 'Name', defaultValue: model.Name, type: 'text', disabled: true },
            { title: '所属分类', name: 'Category.Name', defaultValue: model.Category.Name, type: 'text', disabled: true },
            { title: '现有数量', name: 'Number', defaultValue: model.Number.toString(), type: 'text', disabled: true },
        ];
        if (model.Description) {
            items.push({ title: '物品描述', name: 'Description', defaultValue: model.Description, type: 'textarea', disabled: true })
        }
        return items;
    }

    render() {
        const model = this.props.navigation.state.params.model
        if (!model) {
            Toast.show({ text: '参数错误', type: 'danger' })
            return null;
        }

        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>物品详细信息</Title>
                    </Body>
                </Header>
                <Content>
                    <Detail items={this.getItems(model)} />
                </Content>
                <Footer>
                    <Button iconLeft={true} transparent onPress={this.handleApplyClick} disabled={!model.Status}>
                        <Icon name="plus" />
                        <Text>我要申请</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}
export default GoodsDetail;