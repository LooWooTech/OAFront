import React from 'react';
import { Affix, Table, Button, Popconfirm, Input, Select, Checkbox, Radio } from 'antd';
import EditModal from '../shared/_formmodal';
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
    getNodeFormItems = (record, nodes) => {
        record = record || {
            ID: 0, Name: '', FlowId: 0, PrevId: '0', UserId: 0, DepartmentId: 0, GroupId: 0, FreeFlowId: 0, JobTitleId: 0
        };
        record.FreeFlow = record.FreeFlow || { ID: 0, LimitMode: 2, DepartmentIds: [], CrossDepartment: false, CrossLevel: false };

        const openFreeFlow = this.state.openFreeFlow === record.ID || record.FreeFlowId > 0;
        nodes = nodes || [];
        var items = [
            { name: 'ID', defaultValue: record.ID, render: <Input type="hidden" /> },
            { name: 'FlowId', defaultValue: record.FlowId, render: <Input type="hidden" /> },
            { name: 'FreeFlowId', defaultValue: openFreeFlow ? record.FreeFlowId : 0, render: <Input type="hidden" /> },
            { title: '名称', name: 'Name', defaultValue: record.Name, render: <Input /> },
            {
                title: '前一节点',
                name: 'PrevId',
                defaultValue: record.PrevId.toString(),
                render:
                <Select>
                    <Select.Option value='0'>无</Select.Option>
                    {nodes.map((node, key) => <Select.Option
                        key={node.ID}
                        disabled={node.ID === record.ID}>
                        {node.Name}</Select.Option>)}
                </Select>
            }, {
                title: '受理人',
                name: 'UserId',
                defaultValue: record.UserId === 0 ? '' : record.UserId.toString(),
                render:
                <Select mode="combobox" showSearch={true}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => {
                        if (!value) return;
                        api.User.List({ searchKey: value }, json => this.setState({ users: json.List }))
                    }}
                    placeholder="请输入姓名"
                    optionLabelProp="children"
                >
                    {(this.state.users || []).map((item, key) =>
                        <Select.Option key={key} value={(item.ID || '').toString()}>
                            {item.RealName}
                        </Select.Option>)}
                </Select>
            }, {
                title: '受理部门',
                name: 'DepartmentId',
                defaultValue: record.DepartmentId.toString(),
                render:
                <Select>
                    <Select.Option key={0}>无</Select.Option>
                    {this.state.departments.map((item, key) =>
                        <Select.Option key={item.ID} title={item.Name}>
                            {item.Name}
                        </Select.Option>)}
                </Select>
            }, {
                title: '受理职务',
                name: 'JobTitleId',
                defaultValue: record.JobTitleId.toString(),
                render:
                <Select>
                    <Select.Option key={0}>无</Select.Option>
                    {this.state.titles.map((item, key) =>
                        <Select.Option key={item.ID}>
                            {item.Name}
                        </Select.Option>)}
                </Select>
            }, {
                title: '受理用户组',
                name: 'GroupId',
                defaultValue: record.GroupId.toString(),
                render:
                <Select>
                    <Select.Option key={0}>无</Select.Option>
                    {this.state.groups.map((item, key) =>
                        <Select.Option key={item.ID}>
                            {item.Name}
                        </Select.Option>)}
                </Select>
            }, {
                title: '开启自由流程',
                name: 'OpenFreeFlow',
                render: <Checkbox defaultChecked={record.FreeFlowId > 0} onChange={e => this.setState({ openFreeFlow: e.target.checked ? record.ID : 0 })} >开启</Checkbox>
            }];
        if (openFreeFlow) {
            items = items.concat(this.getFreeFlowFormItems(record.FreeFlow));
        }
        return items;
    };

    getFreeFlowFormItems = (record) => {
        record = record || { ID: 0, LimitMode: 2, DepartmentIds: [], CrossDepartment: false, CrossLevel: false };
        var items = [{
            title: '限制部门',
            name: 'FreeFlow.LimitMode',
            defaultValue: record.LimitMode,
            render:
            <Radio.Group onChange={e => this.setState({ limitMode: e.target.value })}>
                <Radio value={1}>指定部门</Radio>
                <Radio value={2}>当前部门</Radio>
                <Radio value={3}>拟稿人部门</Radio>
            </Radio.Group>
        }];
        var limitMode = this.state.limitMode === undefined ? record.LimitMode : this.state.limitMode;
        if (limitMode === 1) {
            items.push({
                title: '选择指定部门',
                name: 'FreeFlow.DepartmentIds',
                defaultValue: (record.DepartmentIds || []).map(id => id.toString()),
                render:
                <Select mode="multiple">
                    {this.state.departments.map(item =>
                        <Select.Option key={item.ID}>{item.Name}</Select.Option>
                    )}
                </Select>
            })
        }
        items.push({
            title: '跨部门',
            defaultValue: record.CrossDepartment,
            name: 'FreeFlow.CrossDepartment',
            render: <Checkbox defaultChecked={record.CrossDepartment}> 可跨部门</Checkbox>
        });
        items.push({
            title: '跨级别',
            name: 'FreeFlow.CrossLevel',
            defaultValue: record.CrossLevel,
            render: <Checkbox defaultChecked={record.CrossLevel}> 可跨级别</Checkbox>
        });
        return items;
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
                { title: '审核角色', dataIndex: 'Group.Name' },
                {
                    title: '操作', dataIndex: 'ID', width: 200, render: (text, item) =>
                        <Button.Group>
                            <EditModal
                                name="修改节点"
                                onSubmit={this.onNodeSave}
                                trigger={<Button icon="edit">编辑</Button>}
                                children={this.getNodeFormItems(item, record.Nodes)}
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
                    <EditModal
                        name="添加流程"
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
                                <EditModal
                                    name="添加节点"
                                    children={this.getNodeFormItems(null, item.Nodes)}
                                    onSubmit={this.onNodeSave}
                                    trigger={<Button icon="add">添加节点</Button>}
                                />
                                <EditModal
                                    name="修改流程"
                                    children={this.getFlowFormItems(item)}
                                    onSubmit={this.onEditSave}
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