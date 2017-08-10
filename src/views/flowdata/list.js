import React, { Component } from 'react'
import { Table, Badge } from 'antd'
import moment from 'moment'
import auth from '../../models/auth'
import FlowNodeForm from './_form'
import FreeFlowNodeForm from '../freeflow/_form'

class FlowDataList extends Component {
    state = { loading: true }
    componentWillMount() {
        this.buildData();
    }

    buildData = () => {
        let { flowData, canSubmitFlow, canSubmitFreeFlow, flowNodeData, freeFlowNodeData } = this.props;
        let data = { flowData, canSubmitFlow, canSubmitFreeFlow }

        data.list = flowData.Nodes.sort((a, b) => a.ID > b.ID);
        data.infoId = flowData.InfoId;
        let currentUser = auth.getUser();
        if (canSubmitFlow) {
            data.flowNodeData = flowData.Nodes.sort((a, b) => a.ID < b.ID).find(e => e.UserId === currentUser.ID);
        }
        if (canSubmitFreeFlow) {
            data.freeFlowNodeData = data.freeFlowNodeData || (data.flowNodeData && data.flowNodeData.FreeFlowData.Nodes.sort((a, b) => a.ID < b.ID).find(e => e.UserId === currentUser.ID))
        }
        this.setState({ loading: false, ...data })
    }

    contentRender = (text, item) => text ? text.split('\n').map((str, key) => <span key={key}>{str}<br /></span>) : item.Result ? '同意' : null;

    expandedRowRender = (item) => {
        if (!item.FreeFlowData) return null;
        let list = item.FreeFlowData.Nodes.filter(e => e.IsCc);
        if (list.length === 0) return null;
        return <Table
            rowKey="ID"
            showHeader={false}
            dataSource={list}
            pagination={false}
            columns={[
                { title: '收件人', dataIndex: 'Signature', width: 150, },
                { title: '意见', dataIndex: 'Content', render: this.contentRender },
                { title: '日期', dataIndex: 'UpdateTime', width: 150, render: (text, item) => text ? moment(text).format('ll') : null },
                { title: '', width: 140 }
            ]}
        />
    }

    buildFreeFlowNodeTreeData = (node, list) => {
        node.children = list.filter(e => e.ParentId === node.ID);
        node.children.map(e => this.buildFreeFlowNodeTreeData(e, list))
        return node;
    }

    //提交流程
    handleSubmitFlow = (data) => {

    }

    render() {
        if (this.state.loading) return null;
        return (
            <div>
                <Table
                    loading={this.state.loading}
                    rowKey="ID"
                    dataSource={this.state.list}
                    pagination={false}
                    defaultExpandAllRows={true}
                    expandedRowRender={this.expandedRowRender}
                    columns={[
                        {
                            title: '审核人', dataIndex: 'Signature', width: 150,
                            render: (text, item) => <span>
                                <Badge status={item.Result ? 'success' : item.Result === null ? 'processing' : 'error'} />
                                {text}
                            </span>
                        },
                        {
                            title: '意见', dataIndex: 'Content',
                            render: this.contentRender
                        },
                        {
                            title: '审核日期', dataIndex: 'UpdateTime', width: 150,
                            render: (text, item) => text ? moment(text).format('ll') : null
                        },
                        { title: '流程环节', dataIndex: 'FlowNodeName', width: 150 }
                    ]}
                />
                {this.state.canSubmitFreeFlow && this.state.freeFlowNodeData ?
                    <FreeFlowNodeForm />
                    :
                    this.state.canSubmitFlow && auth.isCurrentUser(this.state.flowNodeData.UserId) ?
                        <FlowNodeForm {...this.props} onSubmit={this.handleSubmitFlow} />
                        : null
                }
            </div>
        )
    }
}

export default FlowDataList