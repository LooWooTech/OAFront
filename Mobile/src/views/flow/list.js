import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions, StyleSheet } from 'react-native'
import { Content, Icon, List, ListItem, Text, View, Button, Footer } from 'native-base'

import FlowDataListItem from './_item'
import BackButton from '../shared/BackButton'
import ListEmptyComponent from '../shared/ListEmptyComponent'

class FlowDataList extends Component {

    keyExtractor = (item, index) => item.ID;
    renderItem = ({ item }) => <FlowDataListItem data={item} />

    render() {
        const { infoId, flowData, flowNodeData, canSubmitFlow, canSubmitFreeFlow, freeFlowNodeData, canCompleteFreeFlow, canCancel } = this.props
        const list = flowData.Nodes.sort((a, b) => a.ID - b.ID)
        return (
            <Content>
                <FlatList
                    data={list}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    style={{ height: Dimensions.get('window').height - 185, backgroundColor: '#fff' }}
                    ListEmptyComponent={<ListEmptyComponent icon="retweet" text="没有流程信息" />}
                />
                <Footer style={{ borderTopColor: "#ddd", borderTopWidth: 1, backgroundColor: '#fff', bottom: 0 }}>
                    {canSubmitFreeFlow && freeFlowNodeData && !freeFlowNodeData.Submited ?
                        <Button iconLeft success style={styles.button}>
                            <Icon name="check" />
                            <Text>已阅</Text>
                        </Button>
                        : null}
                    {canSubmitFreeFlow ?
                        <Button iconLeft primary style={styles.button}>
                            <Icon name="share" />
                            <Text>自由发送</Text>
                        </Button>
                        : null}
                    {canCompleteFreeFlow ?
                        <Button iconLeft danger style={styles.button}>
                            <Icon name="close" />
                            <Text>结束自由发送</Text>
                        </Button> : null}
                    {canCancel ?
                        <Button iconLeft warning style={styles.button}>
                            <Icon name="undo" />
                            <Text>撤销</Text>
                        </Button> : null}
                    {canSubmitFlow && flowNodeData && !flowNodeData.Submited ?
                        <Button iconLeft primary style={styles.button}>
                            <Icon name="check-circle" />
                            <Text>主流程审核</Text>
                        </Button>
                        : null}
                </Footer>
            </Content>
        );
    }
}

FlowDataList.propTypes = {
    infoId: PropTypes.number.isRequired,
    flowData: PropTypes.object.isRequired,
    flowNodeData: PropTypes.object.isRequired,
    canSubmitFlow: PropTypes.bool.isRequired,
    canSubmitFreeFlow: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func,
}
const styles = StyleSheet.create({
    button: { padding: 0, margin: 5 },
})
export default FlowDataList;