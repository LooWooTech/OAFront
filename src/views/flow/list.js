import React from 'react';
import { Affix, Table, Button, Popconfirm, Input } from 'antd';
import FlowEditModal from '../shared/_formmodal';
import NodeEditModal from './node_edit';
import api from '../../models/api';

export default class FlowList extends React.Component {
    state = {};
    componentWillMount() {
        api.Department.List(data => this.setState({ departments: data }));
        api.Group.List(data => this.setState({ groups: data }));
        api.JobTitle.List(data => this.setState({ titles: data }));
        this.loadData();
    };

    componentWillUnmount() {
        api.Abort();
    };

    onEditSave = (values) => {
        api.Flow.Save(values, this.loadData);
    };

    onNodeSave = (values) => {
        api.Flow.SaveNode(values, this.loadData);
    };

    loadData = () => {
        api.Flow.List(data => this.setState({ list: data }));
    };
    getFlowFormItems = (record) => {
        record = record || { ID: 0, Name: '' };
        return [{
            name: 'ID',
            defaultValue: record.ID,
            render: <Input type="hidden" />
        }, {
            title: '名称',
            name: 'Name',
            defaultValue: record.Name,
            rules: [{ required: true, message: '请填写名称' }],
            render: <Input />
        }];
    };

    flowNodeList = (record) => {
        return <Table
            rowKey="ID"
            dataSource={record.Nodes}
            pagination={false}
            columns={[
                { title: '节点名称', dataIndex: 'Name' },
                { title: '审核部门', dataIndex: 'Department' },
                { title: '审核人', dataIndex: 'RealName' },
                { title: '审核职务', dataIndex: 'JobTitle' },
                {
                    title: '操作', dataIndex: 'ID', width: 200, render: (text, item) =>
                        <Button.Group>
                            <NodeEditModal
                                title="修改节点"
                                onSubmit={this.onNodeSave}
                                trigger={<Button icon="edit">编辑</Button>}
                                departments={this.state.departments}
                                titles={this.state.titles}
                                nodes={record.Nodes}
                                record={item}
                            />
                            <Popconfirm
                                placement="topRight"
                                title="你确定要删除吗？"
                                onConfirm={() => api.Flow.DeleteNode(item.ID, this.loadData)}
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
        if (!this.state.list || !this.state.departments || !this.state.groups || !this.state.titles) return null;
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <FlowEditModal
                        title="添加流程"
                        onSubmit={this.onEditSave}
                        children={this.getFlowFormItems()}
                        trigger={<Button type="primary" icon="file">添加流程</Button>}
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
                                <NodeEditModal
                                    title="添加节点"
                                    onSubmit={this.onNodeSave}
                                    trigger={<Button icon="add">添加节点</Button>}
                                    departments={this.state.departments}
                                    titles={this.state.titles}
                                    nodes={item.Nodes}
                                />
                                <FlowEditModal
                                    title="修改流程"
                                    onSubmit={this.onEditSave}
                                    children={this.getFlowFormItems(item)}
                                    trigger={<Button icon="edit">编辑</Button>}
                                />
                                <Popconfirm
                                    placement="topRight"
                                    title="你确定要删除吗？"
                                    onConfirm={() => api.Flow.Delete(item.ID, this.loadData)}
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