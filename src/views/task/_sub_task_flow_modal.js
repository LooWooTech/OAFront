import React, { Component } from 'react'
import { Badge, Table } from 'antd'
import moment from 'moment'
import Modal from '../shared/_modal'
class SubTaskFlowModal extends Component {
    render() {
        const list = this.props.list || []
        return (
            <Modal
                title="审核记录"
                width={1000}
                trigger={this.props.trigger}
                children={<Table
                    rowKey="ID"
                    dataSource={list}
                    pagination={false}
                    columns={[
                        {
                            title: '签名', dataIndex: 'Signature', width: 120,
                            render: (text, item) => <Badge text={text} status={item.Result ? 'success' : item.Result === false ? 'error' : 'processing'} />
                        },
                        { title: '内容', dataIndex: 'Content' },
                        {
                            title: '时间', dataIndex: 'UpdateTime', width: 150,
                            render: (text) => text ? moment(text).format('ll') : null
                        }
                    ]}
                />}
            />

        )
    }
}

export default SubTaskFlowModal