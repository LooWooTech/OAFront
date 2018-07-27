import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Body, Title, Content, View, Text, Button, Toast, Footer, Row } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import moment from 'moment'

@inject('stores')
@observer
class GoodsApproval extends Component {
    state = { result: true }
    handleSubmit = () => {
        let formData = this.refs.form.getData()
        formData.Result = this.state.result;
        this.props.stores.goodsStore.approval(formData);
        this.props.navigation.navigate('Goods.ApplyList', { approvalUserId: this.props.stores.userStore.user.ID })
    }

    getFormItems = (model) => {
        return [
            { name: 'ApplyId', defaultValue: model.ID, type: 'hidden' },
            { title: '物品名称', defaultValue: model.Name, type: 'text', disabled: true },
            { title: '申请人', defaultValue: model.ApplyUserName, type: 'text', disabled: true },
            { title: '申请数量', defaultValue: model.Number.toString(), type: 'number' },
            { title: '申请说明', defaultValue: model.Note, type: 'textarea' },
            { title: '申请日期', defaultValue: moment(model.CreateTime).format('lll') },
            {
                title: '是否同意', name: 'Result', type: 'switch', defaultValue: this.state.result,
                onChange: (val) => { this.setState({ result: val }) }
            },
        ];
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
                        <Title>申请物品</Title>
                    </Body>
                </Header>
                <Content>
                    <Form ref="form" items={this.getFormItems(model)} />
                </Content>
                <Footer>
                    <Button transparent onPress={this.handleSubmit}><Text>提交审核</Text></Button>
                </Footer>
            </Container>
        );
    }
}
export default GoodsApproval;