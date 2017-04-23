import React, { Component } from 'react';
import { Input, Select, message } from 'antd';
import FormModal from '../shared/_editmodal'
import api from '../../models/api';

class FreeFlowForm extends Component {
    state = {};

    componentWillMount() {
        const flowNodeData = this.props.flowNodeData;
        this.loadUsers(flowNodeData.ID, '');
    }

    loadUsers = (id, key) => {
        api.FreeFlowData.UserList(id, key, json => this.setState({ users: json }))
    }

    handleSubmit = (data) => {
        if (!data.ToUsers || data.ToUsers.length === 0) {
            message.error("请选择要发送的人");
            return false;
        }
        var toUserIds = data.ToUsers.map(e => e.key).join();
        api.FreeFlowData.Submit(toUserIds, data, json => {
            message.success("提交成功");
            const callback = this.props.callback;
            if (callback) {
                callback(json);
            }
        });
    };
    getFormItems = (flowNodeData) => {
        const model = this.props.record || {};
        let users = this.state.users || [];
        let parent = flowNodeData.Nodes.find(e => e.ID === model.ParentId)
        if (parent) {
            users.push({ ID: parent.UserId, RealName: parent.Signature });
        }
        if (users.length === 0) return null;
        var items = [
            { name: 'InfoId', defaultValue: this.props.infoId, render: <Input type="hidden" /> },
            { name: 'FlowNodeDataId', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            {
                title: '选择发送人',
                name: 'ToUsers',
                render:
                <Select mode="multiple"
                    showSearch={true}
                    labelInValue={true}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => this.loadUsers(flowNodeData.ID, value)}>
                    {users.map(user =>
                        <Select.Option key={user.ID}>
                            {user.RealName}
                        </Select.Option>)}
                </Select>
            },
        ];
        //如果当前是节点发起人第一次发给别人，则不需要填写content
        if (flowNodeData.Nodes.length > 0) {
            items.push({
                title: '意见', name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            });
        }
        return items;
    };
    render() {
        const { flowNodeData } = this.props;
        if (!flowNodeData) return null;

        return (
            <FormModal
                name="提交自由流程"
                trigger={this.props.children}
                onSubmit={this.handleSubmit}
                children={this.getFormItems(flowNodeData)}
            />
        )
    }
}
export default FreeFlowForm
