import React from 'react';
import { Table, Button, Popconfirm, Input, Select } from 'antd';
import EditModal from '../shared/_formmodal';
import Form from '../shared/_form'
import api from '../../models/api';

export default class UserList extends React.Component {
    state = {
        loading: true,
        searchKey: '',
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

    handleDelete = (item) => {
        api.User.Delete(item.ID, () => {
            this.loadData()
        })
    }

    handleSubmit = (values) => {
        var data = values;
        api.User.Save(data, data => this.loadData());
    }
    handleSearch = (data) => {
        this.loadData(data.departmentId, data.searchKey)
        return false
    }

    getFormItems = record => {
        record = record || { ID: 0, Username: '', RealName: '', DepartmentId: 0, GroupIds: [], JobTitleId: 0 };

        return [{
            name: 'ID',
            defaultValue: record.ID,
            render: <Input type="hidden" />
        }, {
            title: '用户名',
            name: 'Username',
            defaultValue: record.Username,
            render: <Input />
        }, {
            title: '姓名',
            name: 'RealName',
            defaultValue: record.RealName,
            render: <Input />
        }, {
            title: '职务',
            name: 'JobTitleId',
            defaultValue: record.JobTitleId.toString(),
            render: <Select>
                <Select.Option value='0'>无</Select.Option>
                {this.state.titles.map(item => <Select.Option key={item.ID}>{item.Name}</Select.Option>)}
            </Select>
        }, {
            title: '部门',
            name: 'DepartmentIds',
            defaultValue: (record.Departments || []).map(d => d.ID.toString()),
            render: <Select mode="multiple">
                {this.state.departments.map(item => <Select.Option key={item.ID}>{item.Name}</Select.Option>)}
            </Select>
        }, {
            title: '用户组',
            name: 'GroupIds',
            defaultValue: (record.Groups || []).map(g => g.ID.toString()),
            render: <Select mode="multiple">
                {this.state.groups.map(item => <Select.Option key={item.ID}>{item.Name}</Select.Option>)}
            </Select>
        },
        {
            title: '排序',
            name: 'Sort',
            defaultValue: (record.Sort || 0),
            layout: { labelCol: { span: 6 }, wrapperCol: { span: 3 } },
            render: <Input />
        }
        ];
    };

    render() {
        return <div>
            <div className="toolbar">
                <Button.Group>
                    <EditModal
                        name="用户"
                        trigger={<Button type="primary" icon="file">添加用户</Button>}
                        onSubmit={this.handleSubmit}
                        children={this.getFormItems()}
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
                    { title: '用户组', render: (text, item) => (item.Groups || []).map(g => g.Name).join() },
                    { title: '部门', render: (text, item) => (item.Departments || []).map(d => d.Name).join() },
                    { title: '职务', dataIndex: 'JobTitle' },
                    {
                        title: '操作', width: 200,
                        render: (text, item) => (
                            <span>
                                <EditModal
                                    name="用户"
                                    onSubmit={this.handleSubmit}
                                    children={this.getFormItems(item)}
                                    trigger={<Button icon="edit">编辑</Button>}
                                />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={this.handleDelete}
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