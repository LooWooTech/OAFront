import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class MessageList extends Component {

    state = {
        loading: true,
        page: {
            pageSize: 20,
            current: parseInt(this.props.location.query.page || '1', 10),
            total: 0
        },
        list: []
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = (query) => {
        query = query || this.props.location.query || {}
        let parameter = {
            hasRead: query.hasRead || '',
            formId: query.formId || 0,
            action: query.action || 'receive',
            page: query.page || 1,
            rows: this.state.page.pageSize
        };
        api.Message.List(parameter, data => {
            this.setState({
                loading: false,
                list: data.List,
                page: data.Page,
                hasRead: parameter.hasRead,
                formId: parameter.formId,
                action: parameter.action,
            });
        });
    }

    handleRead = id => {
        api.Message.Read(id, this.loadData)
    }

    handleDelete = id => {
        api.Message.Delete(id, this.loadData)
    }

    handlePageChange = (page, pageSize) => {
        utils.ReloadPage({ page })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.loadData(nextProps.location.query);
        }
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <h3>
                        我{this.state.action === 'receive' ? '收到' : '发出'}的
                        {api.Form.GetName(this.state.formId)}
                        消息
                    </h3>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: 'ID', dataIndex: 'ID', width: 50 },
                        { title: '发送人', dataIndex: 'FromUser', },
                        { title: '发送时间', dataIndex: 'CreateTime', render: (text) => moment(text).format('ll') },
                        { title: '内容', dataIndex: 'Content' },
                        { title: '状态', dataIndex: 'HasRead', render: (text) => text ? "已读" : "未读" },
                        {
                            title: '操作', width: 210,
                            render: (text, item) => (
                                <span>
                                    {!item.HasRead ?
                                        <Button type="primary" icon="check" onClick={() => this.handleRead(item.ID)}>已读</Button>
                                        : null}
                                    <Popconfirm placement="topRight" title="你确定要删除吗？"
                                        onConfirm={() => this.handleDelete(item.ID)}
                                        okText="是" cancelText="否">
                                        <Button type="danger" icon="delete">删除</Button>
                                    </Popconfirm>
                                </span>
                            )
                        }
                    ]}
                    dataSource={this.state.list}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: this.handlePageChange,
                    }}
                />
            </div>
        );
    }
}

export default MessageList;