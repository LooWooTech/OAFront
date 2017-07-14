import React, { Component } from 'react'
import { Button, Input, Select } from 'antd';
import Modal from '../shared/_formmodal';
import api from '../../models/api';

class EditUserModal extends Component {
    state = {}
    handleSubmit = data => {
        api.User.Save(data, json => {
            this.props.onSubmit()
        })
    }

    getItems = model => {
        model = model || { ID: 0, Username: '', RealName: '', DepartmentId: 0, GroupIds: [], JobTitleId: 0 };
        const departments = this.props.departments || []
        const groups = this.props.groups || []
        const titles = this.props.titles || []
        return [{
            name: 'ID',
            defaultValue: model.ID,
            render: <Input type="hidden" />
        }, {
            title: '用户名',
            name: 'Username',
            defaultValue: model.Username,
            render: <Input />
        }, {
            title: '姓名',
            name: 'RealName',
            defaultValue: model.RealName,
            render: <Input />
        },{
            title: '手机',
            name: 'Mobile',
            defaultValue: model.Mobile,
            render: <Input />
        }, {
            title: '职务',
            name: 'JobTitleId',
            defaultValue: model.JobTitleId ? model.JobTitleId.toString() : '',
            render: <Select>
                <Select.Option value='0'>无</Select.Option>
                {titles.map(item => <Select.Option key={item.ID}>{item.Name}</Select.Option>)}
            </Select>
        }, {
            title: '部门',
            name: 'DepartmentIds',
            defaultValue: (model.Departments || []).map(d => d.ID.toString()),
            render: <Select mode="multiple">
                {departments.map(item => <Select.Option key={item.ID}>{item.Name}</Select.Option>)}
            </Select>
        }, {
            title: '用户组',
            name: 'GroupIds',
            defaultValue: (model.Groups || []).map(g => g.ID.toString()),
            render: <Select mode="multiple">
                {groups.map(item => <Select.Option key={item.ID}>{item.Name}</Select.Option>)}
            </Select>
        },
        {
            title: '排序',
            name: 'Sort',
            defaultValue: (model.Sort || 0),
            layout: { labelCol: { span: 6 }, wrapperCol: { span: 3 } },
            render: <Input />
        }
        ];
    };

    render() {

        const model = this.props.model || {}

        return (
                <Modal
                    name="用户"
                    onSubmit={this.handleSubmit}
                    children={this.getItems(model)}
                    trigger={this.props.trigger}
                />
        )
    }
}

export default EditUserModal