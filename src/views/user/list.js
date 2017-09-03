import React from 'react';
import { Table, Button, Popconfirm, Input, Select } from 'antd';
import EditModal from './_edit';
import Form from '../shared/_form'
import api from '../../models/api';
import utils from '../../utils'

export default class UserList extends React.Component {
    state = {
        loading: true,
        searchKey: this.props.location.query.searchKey || '',
        departmentId: this.props.location.query.departmentId || 0,
        page: {
            pageSize: 20,
            current: parseInt(this.props.location.query.page || '1', 10),
            total: 0
        },
        data: [],
        departments: [],
        groups: [],
        titles: []
    };

    componentWillMount() {
        this.loadData();
        api.Department.List(data => this.setState({ departments: data }));
        api.Group.List(data => this.setState({ groups: data }))
        api.JobTitle.List(data => this.setState({ titles: data }))
    }

    componentWillUnmount() {
        api.Abort();
    };

    loadData = (departmentId = 0, searchKey = '', page = 1) => {
        this.setState({ loading: true })
        api.User.List({
            departmentId: departmentId || 0,
            searchKey: searchKey || this.state.searchKey,
            page: page || this.state.page.current || 1,
            rows: this.state.page.pageSize,
        },
            data => {
                this.setState({
                    loading: false,
                    departmentId: departmentId,
                    data: data.List,
                    page: data.Page,
                })
            });

    };

    handleDelete = (userId) => {
        api.User.Delete(userId, () => {
            this.loadData()
        })
    }

    handleSearch = (data) => {
        utils.ReloadPage({ departmentId: data.departmentId || 0, searchKey: data.searchKey || '' })
        return false
    }

    componentWillReceiveProps(nextProps) {
        let departmentId = nextProps.location.query.departmentId
        let searchKey = nextProps.location.query.searchKey
        if (departmentId !== this.state.departmentId || searchKey !== this.state.searchKey) {
            this.loadData(departmentId, searchKey, 1)
        }
    }


    render() {
        return <div>
            <div className="toolbar">
                <Button.Group>
                    <EditModal
                        title="添加用户"
                        onSubmit={this.loadData}
                        groups={this.state.groups}
                        departments={this.state.departments}
                        titles={this.state.titles}
                        trigger={<Button type="primary" icon="file">添加用户</Button>}
                    />
                </Button.Group>
                <Form
                    onSubmit={this.handleSearch}
                    style={{ maxWidth: '400px', position: 'absolute', right: '10px', top: '10px' }}
                    layout="inline"
                    children={[
                        {
                            name: 'departmentId', render: <Select
                                style={{ width: '150px' }} placeholder="选择部门"
                            >
                                {this.state.departments.map(d => <Select.Option key={d.ID}>{d.Name}</Select.Option>)}
                            </Select>
                        }, {
                            name: 'searchKey', render: <Input type="text" style={{ width: '120px' }} placeholder="姓名" />
                        }, {
                            render: <Button icon="search" type="primary" htmlType="submit" />
                        }
                    ]}
                />
            </div>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: 'ID', dataIndex: 'ID', width: 50 },
                    { title: '姓名', dataIndex: 'RealName', },
                    { title: '用户名', dataIndex: 'Username' },
                    { title: '手机', dataIndex: 'Mobile' },
                    { title: '部门', render: (text, item) => (item.Departments || []).map(d => d.Name).join() },
                    { title: '职务', dataIndex: 'JobTitle' },
                    { title: '用户组', render: (text, item) => (item.Groups || []).map(g => g.Name).join() },
                    {
                        title: '操作', width: 210,
                        render: (text, item) => (
                            <span>
                                <EditModal
                                    title="修改用户"
                                    onSubmit={() => {
                                        this.loadData(this.state.departmentId, this.state.searchKey, this.state.page.current);
                                    }}
                                    groups={this.state.groups}
                                    departments={this.state.departments}
                                    titles={this.state.titles}
                                    model={item}
                                    trigger={<Button icon="edit">编辑</Button>}
                                />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => this.handleDelete(item.ID)}
                                    okText="是" cancelText="否">
                                    <Button type="danger" icon="delete">删除</Button>
                                </Popconfirm>
                            </span>
                        )
                    }
                ]}
                dataSource={this.state.data}
                pagination={{
                    size: 5, ...this.state.page,
                    onChange: (page, pageSize) => {
                        this.loadData(this.state.departmentId, this.state.searchKey, page)
                    },
                }}
            />

        </div>;
    }
}