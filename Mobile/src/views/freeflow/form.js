import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { TouchableHighlight } from 'react-native'
import { Container, Header, Content, Left, Body, Title, Right, Text, View, Icon, Button, CheckBox, ListItem, Col, Row, Label, Footer } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import ListRow from '../shared/ListRow';

@inject('stores')
@observer
class FreeFlowSubmitForm extends Component {

    state = { toUsers: [], ccUsers: [], sms_to: true, sms_cc: false }

    handleSelectUser = () => {
        this.props.navigation.navigate('SelectUser', {
            formType: 'freeflow',
            key: 'missive_freeflow',
            flowNodeDataId: this.props.stores.formInfoStore.data.flowNodeData.ID,
            onSubmit: (users) => {
                this.setState({ toUsers: users })
            }
        })
    }
    handleSelectCcUser = () => {
        this.props.navigation.navigate('SelectUser', {
            formType: 'freeflow',
            key: 'missive_freeflow_cc',
            flowNodeDataId: this.props.stores.formInfoStore.data.flowNodeData.ID,
            onSubmit: (users) => {
                this.setState({ ccUsers: users })
            }
        })
    }

    handleClickSms = () => {
        this.setState({ sms_to: !this.state.sms_to })
    }
    handleClickSmsCc = () => {
        this.setState({ sms_cc: !this.state.sms_cc })
    }
    handleSubmit = () => {
        const { model, flowNodeData } = this.props.stores.formInfoStore.data
        let formData = this.refs.form.getData()
        const toUserIds = this.state.toUsers.map(user => user.ID)
        const ccUserIds = this.state.ccUsers.map(user => user.ID)
        if (toUserIds.length <= 0) {
            throw new Error('没有选择要发送的人员');
        }

        this.props.stores.formInfoStore.submitFreeFlow(model.ID, flowNodeData.ID,
            toUserIds,
            ccUserIds,
            formData);

        if (this.state.sms_to) {
            this.props.stores.formInfoStore.sendSms(toUserIds, model.ID)
        }
        if (this.state.sms_cc) {
            this.props.stores.formInfoStore.sendSms(ccUserIds, model.ID)
        }
        this.props.navigation.goBack()
    }

    getButtonText = (users) => {
        const maxNum = 5
        if (users.length > 0) {
            let text = '已选'
            for (var i = 0; i < maxNum; i++) {
                if (i < users.length) {
                    text += ' ' + users[i].RealName;
                }
            }
            if (users.length > maxNum) {
                text += ' 等' + users.length + '人';

            }
            return text;
        }
        else {
            return '点击选择人员'
        }
    }

    getFormItems = () => {
        let { flowNodeData, freeFlowNodeData, model } = this.props.stores.formInfoStore.data
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
                            <Text>{this.getButtonText(this.state.toUsers)}</Text>
                        </Button>
                    </Body>
                ),
            },
            {
                title: '通知', render: (
                    <Body>
                        <Row style={{ alignItems: 'center' }} onTouchEnd={this.handleClickSms}>
                            <Col size={1}><CheckBox checked={this.state.sms_to} /></Col>
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
                            <Text>{this.getButtonText(this.state.ccUsers)}</Text>
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
                    <Form ref="form" items={this.getFormItems()} />
                </Content>
                <Footer>
                    <Button iconLeft transparent onPress={this.handleSubmit}>
                        <Icon name="check" />
                        <Text>提交</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

FreeFlowSubmitForm.propTypes = {

};

export default FreeFlowSubmitForm;