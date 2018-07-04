import React, { Component } from 'react';
import { Button, Input, Table, Modal, Radio } from 'antd';
import utils from '../../utils';
import api from '../../models/api';
import auth from '../../models/auth';
import moment from 'moment'
import ApprovalModal from './_approval'

class ApplyList extends Component {
    state = {
        loading: true,
        searchKey: '',
        applyUserId: this.props.applyUserId,
        approvalUserId: this.props.approvalUserId,
        status: this.props.location.query.status || 0,
        page: {
            pageSize: window.defaultRows,
            current: this.props.location.query.page || 1,
            total: 0
        },
        data: []
    };

    loadData = (query) => {
        query = query || this.props.location.query || {}
        let parameter = {
            applyUserId: query.applyUserId || 0,
            approvalUserId: query.approvalUserId || 0,
            status: query.status || 0,
            searchKey: query.searchKey || '',
            page: query.page || 1,
            rows: this.state.page.pageSize
        };

        api.Goods.ApplyList(parameter,
            data => {
                this.setState({
                    loading: false,
                    data: data.List,
                    page: data.Page,
                    status: parameter.status,
                    searchKey: parameter.searchKey,
                    userId: parameter.userId,
                });
            });
    };

    componentWillReceiveProps(nextProps) {
        const { approvalUserId, applyUserId } = nextProps
        if (approvalUserId !== this.state.approvalUserId
            || applyUserId !== this.state.applyUserId
            || nextProps.location.search !== this.props.location.search
        ) {
            this.loadData({
                approvalUserId, applyUserId, ...nextProps.location.query
            })
        }
    }

    componentWillMount() {
        this.loadData();
    }

    handleSearch = searchKey => {
        utils.ReloadPage({ searchKey })
    }

    handlePageChange = page => {
        utils.ReloadPage({ page })
    }
    handleStatusChange = e => utils.ReloadPage({ status: e.target.value })

    handleCancelApply = (item) => {
        Modal.confirm({
            title: '提示',
            content: '你确定要取消此次申请吗？',
            onOk: () => {
                api.Goods.CancelApply(item.ID, () => {
                    this.loadData()
                })
            }
        })

    }

    dateTimeColumnRender = (text, item) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : null);
    resultColumnRender = (text, item) => text === null ? '待审核' : text ? '同意' : '不同意';
    buttonsColumnRender = (text, item) => {
        let btns = [];
        if (auth.isCurrentUser(item.ApplyUserId)) {
            if (item.Result === null) {
                btns.push(<Button key="btn-cancel" icon="undo" onClick={() => this.handleCancelApply(item)}>取消申请</Button>)
            }
        }
        else if (auth.isCurrentUser(item.ApprovalUserId)) {
            if (item.Result === null) {
                btns.push(<ApprovalModal key="btn-approval" model={item} trigger={<Button icon="check">审核</Button>} onSubmit={this.loadData} />)
            }
        }
        return btns;
    }

    tableColumns = () => {
        let items = [
            { title: '物品名称', dataIndex: 'Name' },
            { title: '申请人', dataIndex: 'ApplyUserName', width: 100, },
            { title: '申请数量', dataIndex: 'Number', width: 80 },
            { title: '申请日期', dataIndex: 'CreateTime', width: 150, render: this.dateTimeColumnRender },
            { title: '审核人', dataIndex: 'ApprovalUserName', width: 100, },
            { title: '审核结果', dataIndex: 'Result', width: 80, render: this.resultColumnRender },
            { title: '操作', width: 120, render: this.buttonsColumnRender }
        ];
        if (auth.isCurrentUser(this.props.applyUserId)) {
            items.splice(1, 1)
        } else if (auth.isCurrentUser(this.props.approvalUserId)) {
            items.splice(4, 1)
        }
        return items;
    }

    render() {

        return (
            <div>
                <div className="toolbar">
                    <h3>{this.props.approvalUserId ? '物品审核' : this.props.applyUserId ? '我的申请' : '申请记录'}</h3>
                    <Radio.Group defaultValue={this.state.status} onChange={this.handleStatusChange}>
                        <Radio.Button value={0}>全部</Radio.Button>
                        <Radio.Button value={1}>待审核</Radio.Button>
                        <Radio.Button value={2}>已审核</Radio.Button>
                    </Radio.Group>

                    <div className="right">
                        <Input.Search onSearch={this.handleSearch} placeholder="物品名称" />
                    </div>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={this.tableColumns()}
                    dataSource={this.state.data}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: this.handlePageChange,
                    }}
                />
            </div>
        )
    }
}

export default ApplyList;