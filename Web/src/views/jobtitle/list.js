import React from 'react';
import { Affix, Table, Button, Popconfirm, Input, Select } from 'antd';
import EditModal from '../shared/_formmodal';
import api from '../../models/api';

export default class DepartmentList extends React.Component {
    state = {}
    componentDidMount() {
        this.loadData();
    };
    componentWillUnmount() {
        api.Abort();
    };
    onEditSave = (data) => {
        api.JobTitle.Save(data, json => {
            this.loadData();
        });
    };
    loadData = () => {
        api.JobTitle.List(data => {
            this.setState({ list: data })
        });
    };
    getFormItems = record => {
        record = record || { ID: 0, ParentId: 0, Name: '' };
        return [{
            name: 'ID',
            defaultValue: record.ID,
            render: <Input type="hidden" />
        }, {
            title: '职务',
            name: 'Name',
            defaultValue: record.Name,
            render: <Input />
        }, {
            title: '上级',
            name: 'ParentId',
            defaultValue: record.ParentId.toString(),
            render: <Select name="ParentId">
                <Select.Option value='0'>无</Select.Option>
                {this.state.list.map(item => <Select.Option key={item.ID}>{item.Name}</Select.Option>)}
            </Select>
        }];
    };

    render() {
        if (!this.state.list) return null;

        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal
                        name="职务"
                        trigger={<Button type="primary" icon="file">添加职务</Button>}
                        onSubmit={this.onEditSave}
                        children={this.getFormItems()}
                    />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: 'ID', dataIndex: 'ID', width: 50 },
                    { title: '名称', dataIndex: 'Name', },
                    {
                        title: '操作', width: 200,
                        render: (text, item) => (
                            <span>
                                <EditModal
                                    name="职务"
                                    onSubmit={this.onEditSave}
                                    record={item}
                                    trigger={<Button icon="edit">编辑</Button>}
                                    children={this.getFormItems(item)}
                                />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => api.JobTitle.Delete(item.ID, this.loadData)}
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