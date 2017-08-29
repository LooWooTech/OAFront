import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Input, Table } from 'antd';
import utils from '../../utils';
import api from '../../models/api';
import moment from 'moment'

class TaskList extends Component {
    state = {
        loading: true,
        searchKey: '',
        status: this.props.location.query.status,
        page: {
            pageSize: 10,
            current: this.props.location.query.page || 1,
            total: 0
        },
        data: []
    };

    loadData = (query) => {
        query = query || this.props.location.query || {}
        let parameter = {
            status: (query.status === undefined ? this.state.status : query.status) || '',
            searchKey: (query.searchKey === undefined ? this.state.searchKey : query.searchKey) || '',
            page: query.page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        };

        api.Task.List(parameter,
            data => {
                this.setState({
                    loading: false,
                    data: data.List,
                    page: data.Page,
                    searchKey: parameter.searchKey,
                    status: parameter.status,
                });
            });
    };

    componentWillReceiveProps(nextProps) {
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
                        { title: '任务单号', dataIndex: 'Number', width: 100 },
                        {
                            title: '任务事项', dataIndex: 'Name',
                            render: (text, item) => <Link to={`/task/edit?id=${item.ID}`}>{text}</Link>
                        },
                        {
                            title: '任务来源', render: (text, item) => <span>
                                {item.FromType === 1 ? '省' : item.FromType === 2 ? '市' : item.FromType === 3 ? '区' : ''}
                                {item.From}
                            </span>
                        },
                        {
                            title: '计划完成时间', dataIndex: 'ScheduleDate', width: 150,
                            render: (text, item) => text ? moment(text).format('ll') : null
                        },
                        {
                            title: '更新日期', dataIndex: 'UpdateTime', width: 130,
                            render: (text, item) => text ? moment(text).format('ll') : null
                        },
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

export default TaskList;