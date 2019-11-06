import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native'
import { Container, Header, Content, Left, Body, Title, Right, Text, View, Icon, Button, CheckBox, ListItem, Col, Row, Label, Footer } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import { inject, observer } from 'mobx-react';
import SelectUserButton from '../shared/SelectUserButton'

@inject('stores')
@observer
class FlowSubmitForm extends Component {
    state = { result: true }
    handleSubmit = () => {
        const { canComplete } = this.props.stores.formInfoStore.data
        let data = this.refs.form.getData()
        const toUsers = this.refs.selectUser ? this.refs.selectUser.getSelectedUsers() : []
        data.ToUserId = toUsers && toUsers.length === 1 ? toUsers[0].ID : 0
        if (!canComplete && data.Result && !data.ToUserId) {
            throw new Error("请先选择发送人")
        }
        data.Result = this.state.result;
        if (!data.Result) {
            Alert.alert('提醒', '你确定要退回吗？', [
                { text: '取消', onPress: () => { }, style: 'cancel' },
                {
                    text: '确定', onPress: () => {
                        this.submitFlowData(data)
                    }
                }], {
                cancelable: true
            }
            )
        } else {
            this.submitFlowData(data)
        }
    }
    submitFlowData = data => {
        this.props.stores.formInfoStore.submitFlow(data)
        if (data.sms) {
            this.props.stores.formInfoStore.sendSms(data.ToUserId, data.InfoId)
        }
        this.props.navigation.goBack()
    }

    getNextNodes = () => {
        const { flowNodeData, model } = this.props.stores.formInfoStore.data
        const flowNodes = model.FlowData.Flow.Nodes;
        const list = [];

        let prevNode = flowNodes.find(e => e.ID === flowNodeData.FlowNodeId)
        do {
            const nextNode = flowNodes.find(e => e.PrevId === prevNode.ID);
            list.push(nextNode);
            prevNode = nextNode;
        }
        while (prevNode && prevNode.CanSkip)
        return list;
    }

    getFormItems = () => {
        const { flowNodeData, model, canBack, canComplete } = this.props.stores.formInfoStore.data
        const flowData = model.FlowData
        const flowNodes = model.FlowData.Flow.Nodes;
        const currentNode = flowNodes.find(e => e.ID === flowNodeData.FlowNodeId)
        const prevNode = currentNode ? flowData.Flow.Nodes.find(e => e.ID === currentNode.PrevId) : null
        const nextNode = currentNode ? flowData.Flow.Nodes.find(e => e.PrevId === currentNode.ID) : null
        const items = [
            { name: 'InfoId', defaultValue: flowData.InfoId, type: 'hidden' },
            { name: 'FlowNodeId', defaultValue: flowNodeData.FlowNodeId, type: 'hidden' },
            { name: 'FlowDataId', defaultValue: flowNodeData.FlowDataId, type: 'hidden' },
            { name: 'ID', defaultValue: flowNodeData.ID, type: 'hidden' },
            { name: 'UserId', defaultValue: flowNodeData.UserId, type: 'hidden' },
        ]
        if (prevNode) {
            items.push({ title: '上一环节', render: <Body><Text>{prevNode.Name}</Text></Body> })
        }
        if (currentNode) {
            items.push({ title: '当前环节', render: <Body><Text>{currentNode.Name}</Text></Body> })
        }
        items.push({ title: '审核意见', name: 'Content', defaultValue: flowNodeData.Content, type: 'textarea' });
        if (canBack) {
            items.push({
                title: '是否同意', name: 'Result', type: 'switch', defaultValue: true,
                onChange: (val) => {
                    this.setState({ result: val })
                }
            })
        }

        if (nextNode && this.state.result) {
            //如果下一个节点可以跳过，则罗列出后面所有可以跳过的节点 直到最后一个不可以跳过的节点为止
            let nextFlowNodeId = this.state.nextFlowNodeId === undefined ? nextNode.ID : this.state.nextFlowNodeId
            if (nextNode.CanSkip) {
                let nextNodes = this.getNextNodes();
                items.push({
                    title: '下一环节', name: 'NextFlowNodeId', defaultValue: nextFlowNodeId, type: 'select',
                    options: nextNodes.map(e => ({ text: e.Name, value: e.ID })),
                    onChange: (val) => {
                        this.setState({ nextFlowNodeId: val })
                    }
                });
            }
            else {
                items.push({ title: '下一环节', render: <Body><Text>{nextNode.Name}</Text></Body> })
            }
            //如果可以结束，且同意，则不需要选择发送人
            if (!canComplete) {
                items.push({
                    title: '选择人员',
                    render: (
                        <Body>
                            <SelectUserButton
                                ref="selectUser"
                                type="flow"
                                name="missive_flow"
                                params={{ flowNodeId: nextFlowNodeId, flowDataId: flowData.ID }}
                            />
                        </Body>
                    )
                })
                items.push({ title: '短信通知', defaultValue: true, name: 'sms', type: 'switch' })
            }
        }
        return items;
    }


    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>主流程审核</Title>
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

FlowSubmitForm.propTypes = {

};

export default FlowSubmitForm;