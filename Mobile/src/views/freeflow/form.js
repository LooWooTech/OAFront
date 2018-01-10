import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { TouchableHighlight } from 'react-native'
import { Container, Header, Content, Left, Body, Title, Right, Text, View, Icon, Button, CheckBox, ListItem, Col, Row, Label, Footer } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import ListRow from '../shared/ListRow';
import SelectUserButton from '../shared/SelectUserButton'

@inject('stores')
@observer
class FreeFlowSubmitForm extends Component {

    state = { sms_to: true, sms_cc: false }

    handleClickSms = () => {
        this.setState({ sms_to: !this.state.sms_to })
    }
    handleClickSmsCc = () => {
        this.setState({ sms_cc: !this.state.sms_cc })
    }
    handleSubmit = () => {
        const { model, flowNodeData } = this.props.stores.formInfoStore.data
        let formData = this.refs.form.getData()
        const toUserIds = this.refs.selectUser.getSelectedUsers().map(user => user.ID)
        const ccUserIds = this.refs.selectCcUser.getSelectedUsers().map(user => user.ID)
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
                        <SelectUserButton
                            ref="selectUser"
                            type="freeflow"
                            name="missive_freeflow"
                            params={{ flowNodeDataId: flowNodeData.ID }}
                        />
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
                        <SelectUserButton
                            ref="selectCcUser"
                            type="freeflow"
                            name="missive_freeflow_cc"
                            params={{ flowNodeDataId: flowNodeData.ID }}
                        />
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