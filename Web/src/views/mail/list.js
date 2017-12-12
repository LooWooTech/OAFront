import React, { Component } from 'react';
import { Button, Table, Icon, Popconfirm } from 'antd'
import { Link } from 'react-router'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class MailReceiveList extends Component {

    state = {
        loading: true,
        selectedRowKeys: [],
        searchKey: '',
        type: this.props.location.query.type,
        list: [],
        page: {
            pageSize: window.defaultRows,
            current: this.props.location.query.page || 1,
            total: 0
        },
    }

    componentWillMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.loadData(nextProps.location.query);
        }
    }


    loadData = (query) => {
        query = query || this.props.location.query || {}
        let parameter = {
            star: query.star || '',
            searchKey: query.searchKey || '',
            type: query.type || 'receive',
            page: query.page || 1,
            rows: this.state.page.pageSize
        };
        api.Mail.List(parameter, json => {
            this.setState({
                loading: false,
                list: json.List,
                page: json.Page,
                ...parameter
            });
        })
    }

    handleSearch = searchKey => {
        utils.ReloadPage({ searchKey, page: 1 })
    };

    handlePageChange = page => {
        utils.ReloadPage({ page })
    }

    handleStar = (id, isStar) => {
        if (isStar) {
            api.UserInfo.Unstar(id, this.loadData)
        }
        else {
            api.UserInfo.Star(id, this.loadData)
        }
    }

    handleDelete = item => {
        if (item.IsDraft) {
            api.Mail.Delete(item.MailId, this.loadData)
        }
        else if (item.Trash) {
            api.UserInfo.Delete(item.ID, this.loadData)
        } else {
            api.UserInfo.Trash(item.ID, this.loadData)
        }
    }

    handleEdit = id => {
        utils.Redirect('/mail/post?id=' + id)
    }

    handleForward = id => {
        utils.Redirect('/mail/post?forwardId=' + id);
    }
    handleRecovery = id => {
        api.UserInfo.Recovery(id, this.loadData)
    }

    getColumns = () => {
        let isSend = this.state.type === 'send' || this.state.type === 'draft';
        let items = []
        if (isSend) {
            items.push({
                title: '收件人', dataIndex: 'ToUsers', width: 200,
                render: (text, item) => item.ToUsers.slice(0, 3).map(e => e.RealName).join()
            });
        } else {
            items.push({
                //星标
                title: '', dataIndex: 'Starred', width: 50,
                render: (text, item) => <Icon style={{ color: 'orange' }} onClick={() => this.handleStar(item.ID, item.Starred)} type={item.Starred ? 'star' : 'star-o'} />
            })
            items.push({ title: '发件人', dataIndex: 'FromUser', width: 100, });
        }
        return items.concat([
            {
                title: '主题', dataIndex: 'Subject',
                render: (text, item) => <Link to={`/mail/${this.state.type === 'draft' ? 'post' : 'detail'}?id=${item.MailId}`}>{item.Subject}</Link>
            },
            {
                title: '时间', dataIndex: 'CreateTime', width: 150,
                render: (text) => moment(text).format('ll')
            },
            {
                title: '操作', dataIndex: 'ID', width: 200,
                render: (text, item) => <div>
                    {this.state.type === 'draft' ? <Button icon="edit" type="primary" title="修改" onClick={() => this.handleEdit(item.MailId)}></Button> : null}

                    <Popconfirm placement="topRight" title={item.IsDraft ? '你确定要删除此草稿吗？' : item.Trash ? '你确定要彻底删除吗？' : '移动到回收站？'}
                        onConfirm={() => this.handleDelete(item)}
                        okText="是" cancelText="否">
                        <Button type="danger" icon="delete" title="删除"></Button>
                    </Popconfirm>

                    {item.Trash ?
                        <Popconfirm placement="topRight" title="还原到收件箱？"
                            onConfirm={() => this.handleRecovery(item.ID)}
                            okText="是" cancelText="否">
                            <Button type="" icon="rollback" title="还原"></Button>
                        </Popconfirm>
                        : null}
                    {!item.IsDraft ?
                        <Button icon="retweet" title="转发" onClick={() => this.handleForward(item.MailId)}></Button>
                        : null}
                </div>
            }
        ]);
    }

    render() {

        let title = "收件箱";
        switch (this.state.type) {
            case 'send':
                title = '已发送';
                break;
            case 'star':
                title = '星标邮件';
                break;
            case 'draft':
                title = '草稿箱';
                break;
            case 'trash':
                title = '已删除';
                break;
            default:
                title = "收件箱";
                break;
        }

        return (
            <div>
                <div className="toolbar">
                    <h3>{title}</h3>
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

export default MailReceiveList;