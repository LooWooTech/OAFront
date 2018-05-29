import React, { Component } from 'react'
import { Badge, Table, Button } from 'antd'
import moment from 'moment'
import Modal from '../shared/_modal'

export default class CheckLogModal extends Component {

    signatureColumnRender = (text, item) => <Badge text={text} status={item.Result ? 'success' : item.Result === false ? 'error' : 'processing'} />
    updateTimeColumnRender = (text, item) => text ? moment(text).format('ll') : null
    render() {
        const { flowData, extendId } = this.props;
        const list = flowData ? flowData.Nodes.sort((a, b) => a.ID - b.ID) : [];
        const logs = extendId ? list.filter(e => e.ExtendId === extendId) : list;
        return (
            <Modal
                title="审核记录"
                width={1000}
                trigger={this.props.trigger || <Button>审核记录</Button>}
                children={<Table
                    rowKey="ID"
                    dataSource={logs}
                    pagination={false}
                    onSubmit={() => true}
                    columns={[
                        { title: '签名', dataIndex: 'Signature', width: 120, render: this.signatureColumnRender },
                        { title: '内容', dataIndex: 'Content' },
                        { title: '时间', dataIndex: 'UpdateTime', width: 150, render: this.updateTimeColumnRender }
                    ]}
                />}
            />

        )
    }
}
