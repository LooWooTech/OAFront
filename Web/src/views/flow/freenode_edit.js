import React, { Component } from 'react'
import { Radio, Select, Checkbox } from 'antd'
import FormModal from '../shared/_formmodal'
class FreeNodeEditModal extends Component {
    state = {}

    getItems = (record) => {
        record = record || { ID: 0, LimitMode: 2, DepartmentIds: [], CrossDepartment: false, CrossLevel: false };
        var items = [{
            title: '限制部门',
            name: 'LimitMode',
            defaultValue: record.LimitMode,
            render:
            <Radio.Group onChange={e => this.setState({ limitMode: e.target.value })}>
                <Radio value={1}>指定部门</Radio>
                <Radio value={2}>发起人部门</Radio>
                <Radio value={3}>当前部门</Radio>
            </Radio.Group>
        }];
        var limitMode = this.state.limitMode === undefined ? record.LimitMode : this.state.limitMode
        if (limitMode === 1) {
            items.push({
                title: '选择指定部门',
                name: 'DepartmentIds',
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
            name: 'CrossDepartment',
            render: <Checkbox defaultChecked={record.CrossDepartment}> 可跨部门</Checkbox>
        })
        items.push({
            title: '跨级别',
            name: 'CrossLevel',
            defaultValue: record.CrossLevel,
            render: <Checkbox defaultChecked={record.CrossLevel}> 可跨级别</Checkbox>
        })
        items.push({
            render: <legend>终止人员设置</legend>
        })
        items.push({
            title: '所属部门',
            name: 'CompleteUserDepartmentIds',
            defaultValue: (record.CompleteUserDepartmentIds || []).map(id => id.toString()),
            render: <Select mode="multiple" >
                {this.props.departments.map(item =>
                    <Select.Option key={item.ID}>{item.Name}</Select.Option>
                )}
            </Select>
        })
        items.push({
            title: '职务',
            name: 'CompleteUserJobTitleIds',
            defaultValue: (record.CompleteUserJobTitleIds || []).map(id => id.toString()),
            render: <Select  mode="multiple">
                {this.props.titles.map((item, key) =>
                    <Select.Option key={item.ID}>
                        {item.Name}
                    </Select.Option>)}
            </Select>
        })

        return items;
    };

    render() {
        return (
            <FormModal
                title="自由流程设置"
                trigger={this.props.trigger}
                onSubmit={this.props.onSubmit}
                children={this.getItems(this.props.record)}
            />
        )
    }
}

export default FreeNodeEditModal