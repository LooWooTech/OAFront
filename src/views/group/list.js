import React from 'react';
import { Affix, Table, Button, Popconfirm, Input } from 'antd';
import EditModal from '../shared/_editmodal';
import api from '../../models/api';

export default class GroupList extends React.Component {
    state = { list: [] };

    componentDidMount() {
        this.loadPageData();
    };
    componentWillUnmount() {
        api.Abort();
    };
    loadPageData = () => {
        api.Group.List(this, data => this.setState({ list: data }));
    };

    onEditSave = (values) => {
        api.Group.Save(this, values, this.loadPageData);
    }
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

        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal
                        name="添加分组"
                        children={this.getFormItems()}
                        trigger={<Button type="primary" icon="file">添加分组</Button>}
                        onSubmit={this.onEditSave}
                    />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: 'ID', dataIndex: 'ID', width: 50 },
                    { title: '分组名称', dataIndex: 'Name' },
                    {
                        title: '操作', width: 200,
                        render: (text, item) => (
                            <Button.Group>
                                <EditModal
                                    name="编辑分组"
                                    onSubmit={this.onEditSave}
                                    children={this.getFormItems(item)}
                                    trigger={<Button icon="edit">编辑</Button>}
                                />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => api.Group.Delete(this, item.ID, this.loadPageData)}
                                    okText="是" cancelText="否">
                                    <Button type="danger" icon="delete">删除</Button>
                                </Popconfirm>
                            </Button.Group>
                        )
                    }
                ]}
                dataSource={this.state.list}
                pagination={false}
            >
            </Table>
        </div>;
    }
}