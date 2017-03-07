import React from 'react';
import { Affix, Table, Button, Popconfirm } from 'antd';
import NodeModal from './editnode';
import FlowModal from './editflow';
import api from '../../models/api';

export default class FlowList extends React.Component {
    state = {
        list: [],
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
        });
    };

    componentWillUnmount() {
        api.Abort();
    };

    onEditSave = (err, values) => {
        api.Flow.Save(this, values, json => {
            this.loadPageData();
        });
        return false;
    };

    onNodeSave = (err, values) => {
        api.Flow.SaveNode(this, values, json => {
            this.loadPageData();
        });
    };

    loadPageData = () => {
        api.Flow.List(this, data => {
            this.setState({ list: data });
        });
    };

    flowNodeList = (record) => {
        return <Table
            rowKey="ID"
            dataSource={record.Nodes}
            pagination={false}
            columns={[
                { title: '节点名称', dataIndex: 'Name' },
                { title: '审核部门', dataIndex: 'Department.Name' },
                { title: '审核人', dataIndex: 'User.Username' },
                { title: '审核角色', dataIndex: 'Role' },
                {
                    title: '操作', dataIndex: 'ID', width:200, render: (text, item) =>
                        <Button.Group>
                            <NodeModal
                                record={item}
                                onSubmit={this.onNodeSave}
                                departments={this.state.departments}
                                groups={this.state.groups}
                                children={<Button icon="edit">编辑</Button>}
                            />
                            <Popconfirm
                                placement="topRight"
                                title="你确定要删除吗？"
                                onConfirm={() => api.Flow.DeleteNode(this, item.ID, this.loadPageData)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="danger" icon="delete">删除</Button>
                            </Popconfirm>
                        </Button.Group>
                }
            ]}
        ></Table>
    };

    render() {
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <FlowModal
                        onSubmit={this.onEditSave}
                        children={<Button type="primary" icon="file">新建流程模板</Button>}
                    />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                expandedRowRender={this.flowNodeList}
                onExpand={this.onExpand}
                columns={[
                    { title: '名称', dataIndex: 'Name', },
                    {
                        title: '操作', dataIndex: 'ID', width: 300,
                        render: (text, item) => (
                            <span>
                                <NodeModal
                                    departments={this.state.departments}
                                    groups={this.state.groups}
                                    record={{ FlowId: item.ID }}
                                    onSubmit={this.onNodeSave}
                                    children={<Button icon="add">添加节点</Button>}
                                />
                                <FlowModal
                                    record={item}
                                    onSubmit={this.onEditSave}
                                    children={<Button icon="edit">编辑</Button>}
                                />
                                <Popconfirm
                                    placement="topRight"
                                    title="你确定要删除吗？"
                                    onConfirm={() => api.Flow.Delete(this, item.ID, this.loadPageData)}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <Button type="danger" icon="delete">删除</Button>
                                </Popconfirm>
                            </span>
                        )
                    }
                ]}
                dataSource={this.state.list}
                pagination={false}
            />
        </div>;
    }
}