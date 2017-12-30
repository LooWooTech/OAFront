import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet } from 'react-native'
import { Button, Text, Footer, Icon } from 'native-base'
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

        return !show ? null : (
            <Footer style={{ borderTopColor: "#ddd", borderTopWidth: 1, backgroundColor: '#fff', bottom: 0 }}>
                {canSubmitFreeFlow && freeFlowNodeData && !freeFlowNodeData.Submited ?
                    <Button iconLeft success transparent style={styles.button} onPress={this.handleClickRead}>
                        <Icon name="check" />
                        <Text>已阅</Text>
                    </Button>
                    : null}
                {canSubmitFreeFlow ?
                    <Button iconLeft warning transparent style={styles.button} onPress={this.handleClickShare}>
                        <Icon name="share" />
                        <Text>自由发送</Text>
                    </Button>
                    : null}
                {canCompleteFreeFlow ?
                    <Button iconLeft danger transparent style={styles.button} onPress={this.props.onClickComplete}>
                        <Icon name="close" />
                        <Text>结束自由发送</Text>
                    </Button> : null}
                {canCancel ?
                    <Button iconLeft warning transparent style={styles.button} onPress={this.handleCancelFlow}>
                        <Icon name="undo" />
                        <Text>撤销</Text>
                    </Button> : null}
                {canSubmitFlow && flowNodeData && !flowNodeData.Submited ?
                    <Button iconLeft primary transparent style={styles.button} onPress={this.props.onSubmitFlow}>
                        <Icon name="check" />
                        <Text>主流程审核</Text>
                    </Button>
                    : null}
            </Footer>
        );
    }
}
export default MissiveDetailFooter;
const styles = StyleSheet.create({
    button: { padding: 0, margin: 5, height: 40 },
})