import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet } from 'react-native'
import { Button, Text, Footer, Icon, Left, Right } from 'native-base'
import { observer, inject } from 'mobx-react'
@inject('stores')
@observer
class MissiveDetailFooter extends Component {

    state = {
        flowNodeData,
        freeFlowNodeData,
        canSubmitFlow,
        canSubmitFreeFlow,
        canCompleteFreeFlow,
        canCancel
    } = this.props

    handleReadFreeFlow = () => {
        const { model, flowNodeData, freeFlowNodeData } = this.props.data
        Alert.alert('提醒', '确定已阅吗？', [
            { text: '取消', onPress: () => { }, style: 'cancel' },
            {
                text: '确定', onPress: () => {
                    this.props.stores.formInfoStore.flagRead(freeFlowNodeData.ID, model.ID, flowNodeData.ID)
                }
            }], {
                cancelable: true
            }
        )
    }

    handleSubmitFreeFlow = () => {
        this.props.navigation.navigate('FreeFlow.Form')
    }

    handleCompleteFreeFlow = () => {
        const { model, flowNodeData, freeFlowNodeData } = this.props.data
        const list = flowNodeData.FreeFlowData.Nodes.filter(e => !e.IsCc && !e.Submited).map(e => e.Signature);
        let content = '你确定要提前结束自由发送流程吗？\n'
        if (list.length > 0) {
            if (list.length < 5) {
                content += '以下人员尚未阅读：\n' + list.join(' ')
            } else {
                content += '还有' + list.length + '人尚未阅读';
            }
        }
        Alert.alert('提醒', content, [
            { text: '取消', onPress: () => { }, style: 'cancel' },
            {
                text: '确定', onPress: () => {
                    this.props.stores.formInfoStore.completeFreeFlow(model.ID, flowNodeData.ID)
                }
            }], {
                cancelable: true
            }
        )
    }

    handleSubmitFlow = () => {
        this.props.navigation.navigate('Flow.Form')
    }

    handleCancelFlow = () => {
        const { model } = this.props.data
        Alert.alert('提醒', '你确定要撤销流程吗', [
            { text: '取消', onPress: () => { }, style: 'cancel' },
            {
                text: '确定', onPress: () => {
                    this.props.stores.formInfoStore.cancelFlow(model.ID)
                }
            }], {
                cancelable: true
            }
        )
    }

    render() {
        const { model, flowNodeData, freeFlowNodeData,
            canSubmitFlow, canSubmitFreeFlow, canCompleteFreeFlow, canCancel
        } = this.props.data

        const show = canSubmitFlow || canSubmitFreeFlow || canCompleteFreeFlow || canCancel

        const leftButtons = []
        const rightButtons = []
        if (canSubmitFreeFlow && freeFlowNodeData && !freeFlowNodeData.Submited) {
            leftButtons.push(
                <Button key="read" iconLeft success transparent style={styles.button} onPress={this.handleReadFreeFlow}>
                    <Icon name="check" />
                    <Text>已阅</Text>
                </Button>
            )
        }
        if (canSubmitFreeFlow) {
            leftButtons.push(
                <Button key="submitfreeflow" iconLeft warning transparent style={styles.button} onPress={this.handleSubmitFreeFlow}>
                    <Icon name="share" />
                    <Text>转发</Text>
                </Button>
            )
        }
        if (canCompleteFreeFlow) {
            rightButtons.push(
                <Button key="completefreeflow" iconLeft danger transparent style={styles.button} onPress={this.handleCompleteFreeFlow}>
                    <Icon name="close" />
                    <Text>结束</Text>
                </Button>
            )
        }
        if (canCancel) {
            rightButtons.push(
                <Button key="cancel" iconLeft warning transparent style={styles.button} onPress={this.handleCancelFlow}>
                    <Icon name="undo" />
                    <Text>撤销</Text>
                </Button>
            )
        }
        if (canSubmitFlow && flowNodeData && !flowNodeData.Submited) {
            rightButtons.push(
                <Button key="submitflow" iconLeft primary transparent style={styles.button} onPress={this.handleSubmitFlow}>
                    <Icon name="check" />
                    <Text>审核</Text>
                </Button>
            )
        }
        return !show ? null : (
            <Footer style={{ borderTopColor: "#ddd", borderTopWidth: 1, backgroundColor: '#fff', bottom: 0 }}>
                {leftButtons}
                {rightButtons}
            </Footer>
        );
    }
}
export default MissiveDetailFooter;
const styles = StyleSheet.create({
    button: { padding: 0, margin: 5, height: 40 },
})