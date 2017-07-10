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
            pageSize: 20,
            current: this.props.location.query.page || 1,
            total: 0
        },
        data: []
    };

    loadData = (page, searchKey = '', status) => {
        let parameter = {
            status: status || this.state.status,
            searchKey: searchKey || this.state.searchKey,
            page: page || this.state.page.current || 1,
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
        const nextStatus = nextProps.location.query.status

        if (nextStatus !== this.props.location.query.status) {
            this.loadData(1, this.state.searchKey, nextStatus);
        }
    }

    componentWillMount() {
        this.loadData();
    }

    handleSearch = searchKey => {
        this.loadData(this.state.page.current, searchKey);
    };

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
                        { title: '任务事项', dataIndex: 'MC', render: (text, item) => <Link to={`/task/edit?id=${item.ID}`}>{text}</Link> },
                        {
                            title: '任务来源', render: (text, item) => <span>
                                {item.LY_LX === 1 ? '省' : item.LY_LX === 2 ? '市' : '区'}
                                {item.LY}
                            </span>
                        },
                        { title: '计划完成时间', dataIndex: 'JH_SJ', render: (text, item) => text ? moment(text).format('ll') : null },
                        { title: '责任人', dataIndex: 'ZRR_Name' },
                        { title: '所在流程', dataIndex: 'FlowStep' },
                        { title: '处理日期', dataIndex: 'UpdateTime', render: (text, item) => text ? moment(text).format('ll') : null },
                    ]}
                    dataSource={this.state.data}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page, pageSize) => {
                            this.loadData(this.state.formId, page)
                        },
                    }}
                />
            </div>
        )
    }
}

export default TaskList;