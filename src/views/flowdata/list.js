import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Badge } from 'antd'
import moment from 'moment'
import auth from '../../models/auth'
import FlowNodeForm from './_form'
import FreeFlowNodeForm from '../freeflow/_form'
import api from '../../models/api'
class FlowDataList extends Component {
    state = { loading: true, infoId: this.props.infoId, flowDataId: this.props.flowDataId }
    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.FlowData.Model(this.state.flowDataId, this.state.infoId, data => {
            this.setState({ loading: false, ...data })
        })
    }

    contentRender = (text, item, parent) => {
        if (item.hasOwnProperty('Result')) {
            //主流程
            if (item.Result === null && this.state.canSubmitFlow) {
                return <FlowNodeForm
                    {...this.state}
                    onSubmit={this.handleSubmitFlow}
                />
            }
            if (!text) {
                return item.Result === null ? item.FreeFlowData ? '传阅中' : '待审核' : item.Result ? '同意' : '不同意';
            }
        } else if (item.hasOwnProperty('Submited')) {
            //自由流程
            if (!item.Submited && this.state.canSubmitFreeFlow && !item.IsCc && auth.isCurrentUser(item.UserId)) {
                return <FreeFlowNodeForm
                    infoId={this.state.infoId}
                    freeFlowNodeData={item}
                    flowNodeData={parent}
                    onSubmit={this.handleSubmitFlow}
                />
            }
            if (!text) {
                return item.Submited ? '已阅' : '未读';
            }
        }
        return text.split('\n').map((str, key) => <span key={key}>{str}<br /></span>);
    }

    expandedRowRender = (parent) => {
        if (!parent.FreeFlowData) return null;
        let list = parent.FreeFlowData.Nodes.filter(e => !e.IsCc || e.Content);
        if (list.length === 0)  return null;
        return <Table
            rowKey="ID"
            showHeader={false}
            dataSource={list}
            pagination={false}
            columns={[
                { title: '收件人', dataIndex: 'Signature', width: 150, },
                { title: '意见', dataIndex: 'Content', render: (text, item) => this.contentRender(text, item, parent) },
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
        this.loadData();
        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    }

    render() {
        if (this.state.loading) return null;
        return (
            <div>
                <Table
                    loading={this.state.loading}
                    rowKey="ID"
                    dataSource={this.state.flowData.Nodes.sort((a, b) => a.ID > b.ID)}
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
            </div>
        )
    }
}
FlowDataList.propTypes = {
    infoId: PropTypes.number.isRequired,
    flowDataId: PropTypes.number.isRequired,
    onSubmit: PropTypes.func,
}
export default FlowDataList