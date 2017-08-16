import React, { Component } from 'react'
import { Table } from 'antd'
import moment from 'moment'
import utils from '../../utils'

class FreeFlowDataList extends Component {

    contentRender = (text, item) => {
        if (!text) {
            text = item.Submited ? '已阅' : '未读';
        }
        return utils.NewLineToBreak(text);
    }

    render() {
        const freeFlowData = this.props.model;
        if (!freeFlowData) return null;

        const showAll = this.props.showAll;
        let list = freeFlowData.Nodes;
        if (!showAll) {
            list = list.filter(e => !e.IsCc || (e.Submited && e.Content));
        }
        list = list.sort((a, b) => a.ID - b.ID);
        return <Table
            rowKey="ID"
            showHeader={false}
            dataSource={list}
            pagination={false}
            columns={[
                { title: '收件人', dataIndex: 'Signature', width: 150, },
                { title: '意见', dataIndex: 'Content', render: (text, item) => this.contentRender(text, item) },
                { title: '日期', dataIndex: 'UpdateTime', width: 150, render: (text, item) => text ? moment(text).format('ll') : null },
                { title: '', width: 140 }
            ]}
        />
    }
}

export default FreeFlowDataList