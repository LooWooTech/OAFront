import React, { Component } from 'react'
import { Badge, Table } from 'antd'
import moment from 'moment'
import Modal from '../shared/_modal'
class SubTaskFlowModal extends Component {

    signatureColumnRender = (text, item) => <Badge text={text} status={item.Result ? 'success' : item.Result === false ? 'error' : 'processing'} />
    updateTimeColumnRender = (text, item) => text ? moment(text).format('ll') : null
    render() {
        const list = (this.props.list || []).sort((a, b) => a.ID - b.ID)
        return (
            <Modal
                title="审核记录"
                width={1000}
                trigger={this.props.trigger}
                children={<Table
                    rowKey="ID"
                    dataSource={list}
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

export default SubTaskFlowModal