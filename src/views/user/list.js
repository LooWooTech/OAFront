import React from 'react';
import { Affix, Table, Button, Popconfirm } from 'antd';
import EditModal from './edit';
import api from '../../models/api';

export default class UserList extends React.Component {
    state = {
        searchKey: '',
        page: {
            pageSize: 20,
            current: parseInt(this.props.location.query.page || '1', 10),
            total: 0
        },
        data: [],
        departments: [],
        groups: []
    };

    componentWillMount() {
        this.loadPageData();
        api.Department.List(this, data => {
            this.setState({ departments: data });
        });
        api.Group.List(this, data => {
            this.setState({ groups: data });
        })
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
    }

    componentWillUnmount() {
        api.Abort();
    };
    loadPageData = (page, searchKey) => {
        api.User.List(this, {
            page: page || this.state.page.current || 1,
            rows: this.state.page.pageSize,
            searchKey: searchKey || this.state.searchKey,
        },
            data => {
                this.setState({
                    data: data.List,
                    page: data.Page,
                    request: true
                })
            });

    };

    onEditSave = (err, values) => {
        var data = values;
        api.User.Save(this, data, this.loadPageData);
    }

    render() {
        if (!this.state.request) {
            return null;
        }
        const defaultProps = { departments: this.state.departments, groups: this.state.groups }

        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal children={<Button type="primary" icon="file">添加用户</Button>} {...defaultProps} onSubmit={this.onEditSave} />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: 'ID', dataIndex: 'ID', width: 50 },
                    { title: '姓名', dataIndex: 'RealName', },
                    { title: '用户名', dataIndex: 'Username' },
                    {
                        title: '用户组', render: (text, item) => item.Groups.map(g => g.Name).join()
                    },
                    { title: '部门', dataIndex: 'DepartmentName' },
                    {
                        title: '操作', width: 200,
                        render: (text, item) => (
                            <span>
                                <EditModal onSubmit={this.onEditSave} record={item} {...defaultProps} children={<Button icon="edit">编辑</Button>} />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => api.Group.Delete(this, item.ID, this.loadPageData)}
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
                        this.loadPageData(page)
                    },
                }}
            />

        </div >;
    }
}