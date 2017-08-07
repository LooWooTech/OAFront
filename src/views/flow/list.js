import React from 'react';
import { Affix, Table, Button, Popconfirm, Input, Checkbox } from 'antd';
import FlowEditModal from '../shared/_formmodal';
import NodeEditModal from './node_edit';
import api from '../../models/api';

export default class FlowList extends React.Component {
    state = { loading: true };
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

    loadData = () => {
        api.Flow.List(data => this.setState({ list: data, loading: false }));
    };
    getFlowFormItems = (record) => {
        record = record || { ID: 0, Name: '' };
        return [
            { name: 'ID', defaultValue: record.ID, render: <Input type="hidden" /> },
            { title: '名称', name: 'Name', defaultValue: record.Name, rules: [{ required: true, message: '请填写名称' }], render: <Input /> },
            { title: '可否退回', name: 'CanBack', defaultValue: record.CanBack || false, render: <Checkbox defaultChecked={record.CanBack || false}>不同意可以退回到发起人</Checkbox> }
        ];
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
                    title: '操作', dataIndex: 'ID', width: 240, render: (text, item) =>
                        <Button.Group>
                            <NodeEditModal
                                title="修改节点"
                                onSubmit={this.loadData}
                                trigger={<Button icon="edit"></Button>}
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
                                <Button type="danger" icon="delete"></Button>
                            </Popconfirm>
                        </Button.Group>
                }
            ]}
        ></Table>
    };

    render() {
        if (this.state.loading) return false;
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
                defaultExpandAllRows={true}
                onExpand={this.onExpand}
                columns={[
                    { title: '名称', dataIndex: 'Name', },
                    {
                        title: '操作', dataIndex: 'ID', width: 300,
                        render: (text, item) => (
                            <span>
                                <NodeEditModal
                                    title="添加节点"
                                    onSubmit={this.loadData}
                                    trigger={<Button icon="plus"></Button>}
                                    departments={this.state.departments}
                                    titles={this.state.titles}
                                    nodes={item.Nodes}
                                    record={{ ID: 0, Name: '', FlowId: item.ID, PrevId: '0', UserId: 0, DepartmentId: 0, GroupId: 0, FreeFlowId: 0, JobTitleId: 0, LimitMode: 1 }}
                                />
                                <FlowEditModal
                                    title="修改流程"
                                    onSubmit={this.onEditSave}
                                    children={this.getFlowFormItems(item)}
                                    trigger={<Button icon="edit"></Button>}
                                />
                                <Popconfirm
                                    placement="topRight"
                                    title="你确定要删除吗？"
                                    onConfirm={() => api.Flow.Delete(item.ID, this.loadData)}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <Button type="danger" icon="delete"></Button>
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