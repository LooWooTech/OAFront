import React from 'react';
import { Link } from 'react-router';
import { Affix, Button, Input, Table } from 'antd';
import utils from '../../utils';
import api from '../../models/api';

export default class TaskIndex extends React.Component {
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
        api.FormInfo.List({
            formId: api.Forms.Task.ID,
            status: status || this.state.status,
            searchKey: searchKey || this.state.searchKey,
            page: page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        },
            data => {
                this.setState({
                    loading: false,
                    data: data.List,
                    page: data.Page,
                    searchKey,
                    status,
                    request: true
                });
            }, err => this.setState({ loading: false }));
    };

    componentWillReceiveProps(nextProps) {
        const status = nextProps.location.query.status;
        if (status !== this.props.location.query.status) {
            this.loadData(this.state.page.current, this.state.searchKey, status);
        }
    }

    componentWillMount() {
        this.loadData();
    }

    handleSearch = searchKey => {
        this.loadData(1, searchKey);
    };

    render() {

        return (
            <div>
                <Affix offsetTop={0} className="toolbar">
                    <Button.Group>
                        <Button type="primary" icon="file" onClick={() => utils.Redirect('/task/edit')}>新建任务</Button>
                        {/*<Button type="danger" icon="export">导出公文</Button>*/}
                    </Button.Group>
                    <div className="right">
                        <Input.Search onSearch={this.handleSearch} placeholder="标题..." />
                    </div>

                </Affix>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '任务名称', dataIndex: 'Title', render: (text, item) => <Link to={`/task/edit?id=${item.InfoId}`}>{text}</Link> },
                        { title: '审批流程', dataIndex: 'FlowStep' },
                        { title: '处理日期', dataIndex: 'UpdateTime' },
                    ]}
                    dataSource={this.state.data}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page, pageSize) => {
                            this.loadData(page)
                        },
                    }}
                />
            </div>
        )
    }
}
