import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { TouchableHighlight } from 'react-native'
import { Container, Header, Content, Left, Body, Title, Right, Text, View, Icon, Button, CheckBox, ListItem, Col, Row, Label } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import ListRow from '../shared/ListRow';

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
        this.props.navigation.navigate('SelectUser', {
            formType: 'freeflow',
            key: 'missive_freeflow_cc',
            flowNodeDataId: this.props.stores.formInfoStore.model.flowNodeData.ID
        })
    }
    handleClickSms = () => {
        console.log('handleClickSms')
        this.setState({ sms_to: !this.state.sms_to })
    }
    handleClickSmsCc = () => {
        console.log('handleClickSmsCc')
        this.setState({ sms_cc: !this.state.sms_cc })
    }

    getToUserButtonText = () => {

    }
    getCcUsersButtonText = () => {

    }


    getFormItems = () => {
        let { flowNodeData, freeFlowNodeData, model } = this.props.stores.formInfoStore.model
        freeFlowNodeData = freeFlowNodeData || {}
        return [
            { name: 'InfoId', defaultValue: model.ID, type: 'hidden' },
            { name: 'FlowNodeDataID', defaultValue: flowNodeData.ID, type: 'hidden' },
            { name: 'FreeFlowDataId', defaultValue: flowNodeData.ID, type: 'hidden' },
            { name: 'ID', defaultValue: freeFlowNodeData.ID, type: 'hidden' },
            { title: '意见', placeholder: '请填写审批意见', name: 'Content', defaultValue: freeFlowNodeData.Content, type: 'textarea' },
            {
                title: '转发',
                render: (
                    <Body>
                        <Button transparent onPress={this.handleSelectUser}>
                            <Text>选择人员</Text>
                        </Button>
                    </Body>
                ),
            },
            {
                title: '通知', render: (
                    <Body>
                        <Row style={{ alignItems: 'center' }} onTouchEnd={this.handleClickSms}>
                            <Col size={1}><CheckBox checked={this.state.sms_to}/></Col>
                            <Col size={9}><Text>发送短信</Text></Col>
                        </Row>
                    </Body>
                )
            },
            {
                title: '抄送',
                render: (
                    <Body>
                        <Button transparent onPress={this.handleSelectCcUser}>
                            <Text>选择人员</Text>
                        </Button>
                    </Body>
                )
            },
            {
                title: '通知', render: (
                    <Body>
                        <Row style={{ alignItems: 'center' }} onTouchEnd={this.handleClickSmsCc}>
                            <Col size={1}><CheckBox checked={this.state.sms_cc} /></Col>
                            <Col size={9}><Text>发送短信</Text></Col>
                        </Row>
                    </Body>
                )
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