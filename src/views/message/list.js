import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd'
import { Link } from 'react-router'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'
import auth from '../../models/auth'

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
        api.Message.List(parameter, json => {
            this.setState({
                loading: false,
                list: json.List,
                page: json.Page,
                ...parameter
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

    getColumns = () => {
        var list = [
            { title: 'ID', dataIndex: 'ID', width: 50 },
        ];
        if (this.state.action === 'receive') {
            list.push({ title: '发送人', dataIndex: 'FromUser', width: 100 });
        } else {
            list.push({ title: '接收人', dataIndex: 'ToUser', width: 100 });
        }
        return list.concat([{
            title: '发送时间', dataIndex: 'CreateTime', width: 150,
            render: (text) => moment(text).format('ll')
        },
        {
            title: '内容', dataIndex: 'Content',
            render: (text, item) => {
                if (item.FormId) {
                    var form = api.Form.GetForm(item.FormId);
                    return <div>
                        <Link to={form.InfoLink.replace('{ID}', item.InfoId)}>{item.Title}</Link>
                    </div>
                }
                else {
                    return text;
                }
            }
        },
        { title: '状态', dataIndex: 'HasRead', width: 80, render: (text) => text ? "已读" : "未读" },
        {
            title: '操作', width: 210,
            render: (text, item) => (
                <span>
                    {!item.HasRead && auth.isCurrentUser(item.ToUserId) ?
                        <Button type="primary" icon="check" onClick={() => this.handleRead(item.ID)}>已读</Button>
                        : null}
                    <Popconfirm placement="topRight" title="你确定要删除吗？"
                        onConfirm={() => this.handleDelete(item.ID)}
                        okText="是" cancelText="否">
                        <Button type="danger" icon="delete">删除</Button>
                    </Popconfirm>
                </span>
            )
        }]);
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
                    columns={this.getColumns()}
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