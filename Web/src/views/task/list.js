import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Input, Table, Modal, Icon } from 'antd';
import utils from '../../utils';
import api from '../../models/api';
import auth from '../../models/auth';
import moment from 'moment'

class TaskList extends Component {
    state = {
        loading: true,
        searchKey: '',
        status: this.props.location.query.status,
        page: {
            pageSize: window.defaultRows,
            current: this.props.location.query.page || 1,
            total: 0
        },
        hashViewRight: auth.hasRight('Form.Task.View'),
        data: []
    };

    loadData = (query) => {
        query = query || this.props.location.query || {}
        let parameter = {
            status: query.status || '',
            searchKey: query.searchKey || '',
            page: query.page || 1,
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
        let searchKey = nextProps.location.query.searchKey
        let status = nextProps.location.query.status
        if (searchKey !== this.props.location.query.searchKey
            || status !== this.props.location.query.status
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

    buttonsRender = (text, item) => {
        if (!item.Reminded && !item.Completed && auth.hasRight('Form.Task.View')) {
            return <Button onClick={() => this.handleRemind(item)}>催办</Button>
        }
    }

    handleRemind = (item) => {
        Modal.confirm({
            title: '提醒',
            content: '您确定要催办该任务吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                api.FormInfo.Remind(item.ID, josn => {
                    this.loadData(this.props.location.query)
                })
            }
        })
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
                            render: (text, item) => <span>{item.Reminded ? <Icon type="exclamation" className="red"  /> : null}  <Link to={`/task/edit?id=${item.ID}`}>{text}</Link></span>
                        },
                        {
                            title: '任务来源', render: (text, item) => <span>
                                {item.FromType === 1 ? '省' : item.FromType === 2 ? '市' : item.FromType === 3 ? '区' : ''}
                                {item.From}
                            </span>
                        },
                        {
                            title: '计划完成时间', dataIndex: 'ScheduleDate', width: 150,
                            render: (text, item) => text ? moment(text).format('YYYY-MM-DD') : null
                        },
                        {
                            title: '更新日期', dataIndex: 'UpdateTime', width: 150,
                            render: (text, item) => text ? moment(text).format('YYYY-MM-DD HH:mm') : null
                        },
                        {
                            title: '操作', render: this.buttonsRender
                        }
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