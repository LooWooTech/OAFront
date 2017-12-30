import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Content, Left, Body, Title, Right, Text, View, Icon, Button, CheckBox } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import { inject, observer } from 'mobx-react';

@inject('stores')
@observer
class FreeFlowSubmitForm extends Component {

    state = { sms_to: true, sms_cc: false }

    handleSelectUser = () => {
        this.props.navigation.navigate('SelectUser', {
            formType: 'freeflow',
            key: 'missive_freeflow',
            flowNodeDataId: this.props.stores.formInfoStore.model.flowNodeData.ID
        })
    }
    handleSelectCcUser = () => {
        this.props.navigation.navigate('SelectUser', { formType: 'freeflow', key: 'missive_freeflow_cc' })
    }

    getFormItems = () => {
        let { flowNodeData, freeFlowNodeData, model } = this.props.stores.formInfoStore.model
        freeFlowNodeData = freeFlowNodeData || {}
        return [
            { name: 'InfoId', defaultValue: model.ID, type: 'hidden' },
            { name: 'FlowNodeDataID', defaultValue: flowNodeData.ID, type: 'hidden' },
            { name: 'FreeFlowDataId', defaultValue: flowNodeData.ID, type: 'hidden' },
            { name: 'ID', defaultValue: freeFlowNodeData.ID, type: 'hidden' },
            { title: '意见', placeHolder: '请填写审批意见', name: 'Content', defaultValue: freeFlowNodeData.Content, type: 'textarea' },
            {
                title: '转发', render:
                    <Button transparent onPress={this.handleSelectUser}>
                        <Text>选择人员</Text>
                    </Button>
            },
            {
                title: '通知', render:
                    <CheckBox checked={this.state.sms_to}>短信通知</CheckBox>
            },
            {
                title: '抄送', render:
                    <Button transparent onPress={this.handleSelectCcUser}>
                        <Text>选择人员</Text>
                    </Button>
            },
            {
                title: '通知', render:
                    <CheckBox checked={this.state.sms_cc}>短信通知</CheckBox>
            },
        ];
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>自由发送</Title>
                    </Body>
                </Header>
                <Content>
                    <Form items={this.getFormItems()} />
                </Content>
            </Container>
        );
    }
}

FreeFlowSubmitForm.propTypes = {

};

export default FreeFlowSubmitForm;