import React from 'react';
import { Affix, Table, Button, Popconfirm, Input } from 'antd';
import EditModal from '../shared/_formmodal';
import api from '../../models/api';

export default class DepartmentList extends React.Component {
    componentDidMount() {
        this.loadData();
    };
    componentWillUnmount() {
        api.Abort();
    };

    onEditSave = (values) => {
        api.Department.Save(values, json => {
            this.loadData();
        });
    };
    loadData = () => {
        api.Department.List(data => {
            this.setState({ list: data })
        });
    };
    getFormItems = record => {
        record = record || { ID: 0, Name: '' };
        return [{
            name: 'ID',
            defaultValue: record.ID,
            render: <Input type="hidden" />
        }, {
            title: '名称',
            name: 'Name',
            defaultValue: record.Name,
            render: <Input />
        }];
    };
    render() {
        if (!this.state) return null;

        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                   <EditModal
                        name="添加部门"
                        children={this.getFormItems()}
                        trigger={<Button type="primary" icon="file">添加部门</Button>}
                        onSubmit={this.onEditSave}
                    />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: 'ID', dataIndex: 'ID', width: 50 },
                    { title: '部门名称', dataIndex: 'Name', },
                    {
                        title: '操作', width: 200,
                        render: (text, item) => (
                            <span>
                                <EditModal
                                    name="编辑部门"
                                    onSubmit={this.onEditSave}
                                    children={this.getFormItems(item)}
                                    trigger={<Button icon="edit">编辑</Button>}
                                />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => api.Department.Delete(item.ID, this.loadPageData)}
                                    okText="是" cancelText="否">
                                    <Button type="danger" icon="delete">删除</Button>
                                </Popconfirm>
                            </span>
                        )
                    }
                ]}
                dataSource={this.state.list}
            >
            </Table>
        </div>;
    }
}