import React, { Component } from 'react'
import { Input, Select, Checkbox, Radio } from 'antd'
import SharedModal from '../shared/_formmodal'
import api from '../../models/api';
class EditNodeModal extends Component {
    state = {}

    getNodeFormItems = (record, nodes) => {
        record.FreeFlow = record.FreeFlow || { ID: 0, LimitMode: 2, DepartmentIds: [], CrossDepartment: false, CrossLevel: false };

        const openFreeFlow = this.state.openFreeFlow === undefined ? record.FreeFlowId > 0 : this.state.openFreeFlow;
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
                    {(this.props.users || []).map((item, key) =>
                        <Select.Option key={key} value={(item.ID || '').toString()}>
                            {item.RealName}
                        </Select.Option>)}
                </Select>
            }, {
                title: '受理职务',
                name: 'JobTitleId',
                defaultValue: record.JobTitleId.toString(),
                render:
                <Select>
                    <Select.Option key={0}>无</Select.Option>
                    {this.props.titles.map((item, key) =>
                        <Select.Option key={item.ID}>
                            {item.Name}
                        </Select.Option>)}
                </Select>
            },
            {
                title: '限制部门',
                name: 'LimitMode',
                defaultValue: record.LimitMode,
                render:
                <Radio.Group onChange={e => this.setState({ limitMode: e.target.value })}>
                    <Radio value={0}>指定部门</Radio>
                    <Radio value={1}>发起人部门</Radio>
                </Radio.Group>
            }];

        var limitMode = this.state.limitMode === undefined ? record.LimitMode : this.state.limitMode;
        if (limitMode === 0) {
            items.push(items.length - 2, 0, {
                title: '受理部门',
                name: 'DepartmentIds',
                defaultValue: (record.DepartmentIds || []).map(id => id.toString()),
                render:
                <Select mode="multiple">
                    {this.props.departments.map((item, key) =>
                        <Select.Option key={item.ID} title={item.Name}>
                            {item.Name}
                        </Select.Option>)}
                </Select>
            });
        }
        items.push({
            title: '开启自由流程',
            name: 'OpenFreeFlow',
            render: <Checkbox defaultChecked={openFreeFlow} onChange={e => this.setState({ openFreeFlow: e.target.checked })} >开启</Checkbox>
        });
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
            <Radio.Group onChange={e => this.setState({ freeFlowLimitMode: e.target.value })}>
                <Radio value={0}>指定部门</Radio>
                <Radio value={1}>发起人部门</Radio>
                <Radio value={2}>当前部门</Radio>
            </Radio.Group>
        }];
        var limitMode = this.state.freeFlowLimitMode === undefined ? record.LimitMode : this.state.freeFlowLimitMode;
        if (limitMode === 0) {
            items.push({
                title: '选择指定部门',
                name: 'FreeFlow.DepartmentIds',
                defaultValue: (record.DepartmentIds || []).map(id => id.toString()),
                render:
                <Select mode="multiple">
                    {this.props.departments.map(item =>
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

    render() {
        const { record, departments, titles, nodes } = this.props;
        const { title, trigger, onSubmit } = this.props;
        if (!departments || !titles || !nodes) return null;
        return (
            <SharedModal
                title={title}
                trigger={trigger}
                onSubmit={onSubmit}
                children={this.getNodeFormItems(record, nodes)}
            />
        )
    }
}

export default EditNodeModal