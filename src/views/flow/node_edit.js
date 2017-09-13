import React, { Component } from 'react'
import { Input, Select, Button, Radio, Checkbox } from 'antd'
import SharedModal from '../shared/_formmodal'
import FreeNodeModal from './freenode_edit'
import api from '../../models/api';
class EditNodeModal extends Component {
    state = {}

    handleFreeNodeSubmit = data => {
        this.setState({ freeFlow: data })
    }

    handleCloseFreeflow = () => {
        this.setState({ closeFreeFlow: true })
    }

    handleSubmit = data => {
        data.FreeFlow = this.state.freeFlow === undefined ? data.FreeFlow : this.state.freeFlow
        if (this.state.closeFreeFlow) {
            data.FreeFlow = null;
            data.FreeFlowId = 0;
        }
        api.Flow.SaveNode(data, json => {
            if (this.props.onSubmit) {
                this.props.onSubmit(json)
            }
        })
    }


    getNodeFormItems = (record, nodes) => {
        record.FreeFlow = this.state.freeFlow === undefined ? record.FreeFlow : this.state.freeFlow || { ID: 0, LimitMode: 2, DepartmentIds: [], CrossDepartment: false, CrossLevel: false }
        const openFreeFlow = this.state.openFreeFlow === undefined ? record.FreeFlowId > 0 : this.state.openFreeFlow
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
            },
            {
                title: '可跳过', name: 'CanSkip',
                render: <Checkbox
                    checked={this.state.canSkip === undefined ? record.CanSkip : this.state.canSkip}
                    onClick={e => this.setState({ canSkip: e.target.checked })}>
                    该节点可以跳过
                    </Checkbox>
            },
            {
                title: '受理人',
                name: 'UserIds',
                defaultValue: (record.UserIds || []).map(id => id.toString()),
                render:
                <Select mode="multiple"
                    showSearch={true}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => {
                        if (!value) return;
                        api.User.List({ searchKey: value }, json => this.setState({ users: json.List }))
                    }}
                >
                    {(this.state.users || []).map((item, key) =>
                        <Select.Option key={key} value={(item.ID || '').toString()}>
                            {item.RealName}
                        </Select.Option>)}
                </Select>
            },
            {
                title: '受理职务',
                name: 'JobTitleIds',
                defaultValue: (record.JobTitleIds || []).map(id => id.toString()),
                render:
                <Select mode="multiple">
                    {this.props.titles.map((item, key) =>
                        <Select.Option key={item.ID}>
                            {item.Name}
                        </Select.Option>)}
                </Select>
            },
            {
                title: '限制部门',
                name: 'LimitMode',
                defaultValue: (record.LimitMode || 0).toString(),
                render:
                <Radio.Group onChange={e => this.setState({ limitMode: parseInt(e.target.value, 10) })}>
                    <Radio value='0'>不限制</Radio>
                    <Radio value='1'>指定部门</Radio>
                    <Radio value='2'>发起人部门</Radio>
                </Radio.Group>
            }];

        var limitMode = this.state.limitMode === undefined ? record.LimitMode : this.state.limitMode;
        if (limitMode === 1) {
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
            title: '自由流程',
            render:
            <div>
                {record.FreeFlowId > 0 || this.state.freeFlow ? <Button onClick={this.handleCloseFreeflow}>关闭自由流程 </Button> : null}
                <FreeNodeModal
                    record={record.FreeFlow}
                    departments={this.props.departments}
                    titles={this.props.titles}
                    onSubmit={this.handleFreeNodeSubmit}
                    trigger={<Button>设置</Button>} />
            </div>
        });
        return items;
    };

    render() {
        const { record, departments, titles, nodes } = this.props;
        const { title, trigger } = this.props;
        if (!departments || !titles || !nodes) return null;
        return (
            <SharedModal
                title={title}
                trigger={trigger}
                onSubmit={this.handleSubmit}
                children={this.getNodeFormItems(record, nodes)}
            />
        )
    }
}

export default EditNodeModal