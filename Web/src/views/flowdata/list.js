import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Badge } from 'antd'
import moment from 'moment'
import FlowNodeForm from './_form'
import FreeFlowDataList from '../freeflow/_list'
import FreeFlowNodeForm from '../freeflow/_form'
import utils from '../../utils'

class FlowDataList extends Component {
    state = { showAll: false, }
    contentColumnRender = (text, item) => {
        if (!text) {
            text = item.Result === null ? item.FreeFlowData ? '传阅中' : '待审核' : item.Result ? '同意' : '不同意';
        }

        return <span>
            {utils.NewLineToBreak(text)}&nbsp;&nbsp;
            {item.FreeFlowData ?
                <Button onClick={() => this.setState({ showAll: !this.state.showAll })} icon="eye">
                    {this.state.showAll ? '隐藏抄送和未读' : '显示全部'}
                </Button>
                : null}
        </span>
    }

    expandedRowRender = (parent) => {
        if (!parent.FreeFlowData) return null;
        return <FreeFlowDataList model={parent.FreeFlowData} showAll={this.state.showAll} />
    }

    buildFreeFlowNodeTreeData = (node, list) => {
        node.children = list.filter(e => e.ParentId === node.ID);
        node.children.map(e => this.buildFreeFlowNodeTreeData(e, list))
        return node;
    }

    //提交流程
    handleSubmitFlow = (data) => {
        if (this.props.onSubmit) {
            this.props.onSubmit(data);
        }
    }

    signatureColumnRender = (text, item) => (
        <span>
            <Badge status={item.Result ? 'success' : item.Result === null ? 'processing' : 'error'} />
            {text}
        </span>
    )
    updateTimeColumnRender = (text, item) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null

    render() {
        const { infoId, flowData, flowNodeData, canSubmitFlow, canSubmitFreeFlow, freeFlowNodeData } = this.props
        return (
            <div>
                {canSubmitFreeFlow && freeFlowNodeData && !freeFlowNodeData.Submited && !freeFlowNodeData.IsCc ?
                    <div className="flow-form">
                        <h3>自由发送</h3>
                        <FreeFlowNodeForm
                            infoId={infoId}
                            freeFlowNodeData={freeFlowNodeData}
                            flowNodeData={flowNodeData}
                            onSubmit={this.handleSubmitFlow}
                        />
                    </div>
                    :
                    canSubmitFlow && flowNodeData && !flowNodeData.Submited ?
                        <div className="flow-form">
                            <h3>主流程审核</h3>
                            <FlowNodeForm
                                {...this.props}
                                onSubmit={this.handleSubmitFlow}
                            />
                        </div>
                        : null
                }
                <Table
                    rowKey="ID"
                    dataSource={flowData.Nodes.sort((a, b) => a.ID - b.ID)}
                    pagination={false}
                    defaultExpandAllRows={true}
                    expandedRowRender={this.expandedRowRender}
                    columns={[
                        { title: '审核人', dataIndex: 'Signature', width: 150, render: this.signatureColumnRender },
                        { title: '意见', dataIndex: 'Content', render: this.contentColumnRender },
                        { title: '审核日期', dataIndex: 'UpdateTime', width: 170, render: this.updateTimeColumnRender },
                        { title: '流程环节', dataIndex: 'FlowNodeName', width: 150 }
                    ]}
                />
            </div>
        )
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
export default FlowDataList