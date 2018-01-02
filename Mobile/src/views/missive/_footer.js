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

    handleClickRead = () => {
        const { model, flowNodeData, freeFlowNodeData, onClickRead } = this.props
        Alert.alert('提醒', '确定已阅吗？', [
            { text: '取消', onPress: () => { }, style: 'cancel' },
            {
                text: '确定', onPress: () => {
                    this.props.stores.formInfoStore.submitFreeFlow(freeFlowNodeData.ID, model.ID, flowNodeData.ID)
                }
            }], {
                cancelable: true
            }
        )
    }

    handleClickShare = () => {
        this.props.navigation.navigate('FreeFlow.Form')
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
                <Button key="read" iconLeft success transparent style={styles.button} onPress={this.handleClickRead}>
                    <Icon name="check" />
                    <Text>已阅</Text>
                </Button>
            )
        }
        if (canSubmitFreeFlow) {
            leftButtons.push(
                <Button key="submitfreeflow" iconLeft warning transparent style={styles.button} onPress={this.handleClickShare}>
                    <Icon name="share" />
                    <Text>转发</Text>
                </Button>
            )
        }
        if (canCompleteFreeFlow) {
            rightButtons.push(
                <Button key="completefreeflow" iconLeft danger transparent style={styles.button} onPress={this.props.onClickComplete}>
                    <Icon name="close" />
                    <Text>结束转发</Text>
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
                <Button key="submitflow" iconLeft primary transparent style={styles.button} onPress={this.props.onSubmitFlow}>
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