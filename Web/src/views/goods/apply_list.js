import React, { Component } from 'react';
import { Button, Input, Table } from 'antd';
import utils from '../../utils';
import api from '../../models/api';
import auth from '../../models/auth';
import moment from 'moment'
import ApprovalModal from './_approval'

class ApplyList extends Component {
    state = {
        loading: true,
        searchKey: '',
        userId: this.props.location.query.userId,
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
            userId: query.userId || 0,
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
                    searchKey: parameter.searchKey,
                    userId: parameter.userId,
                });
            });
    };

    componentWillReceiveProps(nextProps) {
        let searchKey = nextProps.location.query.searchKey
        let userId = nextProps.location.query.userId
        if (searchKey !== this.props.location.query.searchKey
            || userId !== this.props.location.query.userId
        ) {
            nextProps.location.query.page = 1;
        }
        if (nextProps.location.search !== this.props.location.search) {
            this.loadData(nextProps.location.query);
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

    dateTimeColumnRender = (text, item) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : null);
    resultColumnRender = (text, item) => text === null ? '待审核' : text ? '同意' : '不同意';
    buttonsColumnRender = (text, item) => {
        let btns = [];
        if (auth.isCurrentUser(item.ApplyUserId)) {
            if (item.Result === null) {
                btns.push(<Button icon="cancel">取消申请</Button>)
            }
        }
        else if (auth.isCurrentUser(item.ApplyUserId)) {
            if (item.Result === null) {
                btns.push(<ApprovalModal model={item} trigger={<Button icon="check">审核</Button>} />)
            }
        }
        return btns;
    }

    render() {

        return (
            <div>
                <div className="toolbar">
                    <Button.Group>
                        <Button type="primary" icon="file" onClick={() => utils.Redirect(`/task/edit`)}>
                            新建任务
                        </Button>
                        {/*<Button type="danger" icon="export">导出公文</Button>*/}
                    </Button.Group>
                    <div className="right">
                        <Input.Search onSearch={this.handleSearch} placeholder="文号、标题..." />
                    </div>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '物品名称', dataIndex: 'Name' },
                        { title: '申请人', dataIndex: 'ApplyUserName' },
                        { title: '申请数量', dataIndex: 'Number', width: 80 },
                        { title: '申请日期', dataIndex: 'CreateTime', width: 150, render: this.dateTimeColumnRender },
                        { title: '审核人', dataIndex: 'ApprovalUserName' },
                        { title: '审核结果', dataIndex: 'Result', render: this.resultColumnRender },
                        { title: '操作', render: this.buttonsColumnRender }
                    ]}
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