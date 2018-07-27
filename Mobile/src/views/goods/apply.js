import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Body, Title, Content, View, Text, Button, Toast, Footer, Row } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import SelectUserButton from '../shared/SelectUserButton'
import { FORMS } from '../../common/config';

@inject('stores')
@observer
class GoodsApply extends Component {

    handleSubmit = () => {
        let formData = this.refs.form.getData()
        const toUsers = this.refs.selectUser ? this.refs.selectUser.getSelectedUsers() : []
        formData.ApprovalUserId = toUsers && toUsers.length === 1 ? toUsers[0].ID : 0
        this.props.stores.goodsStore.apply(formData);

        const applyUserId = this.props.stores.userStore.user.ID
        this.props.navigation.navigate('Goods.ApplyList', { applyUserId })
    }

    getFormItems = (model) => {
        return [
            { title: '物品名称', defaultValue: model.Name, type: 'text', disabled: true },
            { title: '现有数量', defaultValue: model.Number.toString(), type: 'text', disabled: true },
            { name: 'GoodsId', defaultValue: model.ID, type: 'hidden' },
            { title: '申请数量', name: 'Number', defaultValue: '1', type: 'number' },
            { title: '申请备注', name: 'Note', defaultValue: '', type: 'textarea' },
            {
                title: '审核人',
                render: (
                    <Body>
                        <SelectUserButton
                            ref="selectUser"
                            type="flow"
                            name="goods_flow"
                            params={{ flowId: FORMS.Goods.FlowId, flowStep: 2 }}
                        />
                    </Body>
                ),
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
                    <Button transparent onPress={this.handleSubmit}><Text>提交申请</Text></Button>
                </Footer>
            </Container>
        );
    }
}
export default GoodsApply;