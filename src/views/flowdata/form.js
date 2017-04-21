import React, { Component } from 'react';
import { Select, Input, Checkbox, message } from 'antd';
import FormModal from '../shared/_editmodal'
import api from '../../models/api';

class FlowForm extends Component {
    state = { isBack: false };

    componentWillMount() {
        this.loadUsers();
    }

    handleSubmit = (data) => {
        const canComplete = this.props.canComplete;

        if (!canComplete && !this.state.isBack && !data.ToUserId) {
            message.error("请先选择发送人");
            return false;
        }

        data.Result = !this.state.isBack;
        if (!data.Result && !confirm('你确定要退回吗？')) return false;

        api.FlowData.Submit(this, data.ToUserId, data.InfoId, data, json => {
            this.setState({ visible: false });
            message.success("提交成功");

            const callback = this.props.callback;
            if (callback) {
                callback(json);
            }
        });
    };

    loadUsers = () => {
        const { flowData, record, canComplete } = this.props;
        if (canComplete) return;
        api.FlowData.UserList(this, flowData.InfoId, record.FlowNodeId, json => this.setState({ users: json }));
    };
    getFormItems = (model, flowData, users) => {
        const { canBack, canComplete } = this.props;
        var items = [
            { name: 'InfoId', defaultValue: flowData.InfoId, render: <Input type="hidden" /> },
            { name: 'FlowNodeId', defaultValue: model.FlowNodeId, render: <Input type="hidden" /> },
            { name: 'FlowDataId', defaultValue: model.FlowDataId, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            {
                title: '意见', name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            },
        ];
        //如果可以结束，且同意，则不需要选择发送人
        if (!canComplete && !this.state.isBack) {
            items.push({
                title: '选择发送人',
                name: 'ToUserId',
                render:
                <Select
                    showSearch={true}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => this.loadUsers(model.ID, value)}>
                    {users.map(user =>
                        <Select.Option key={user.ID}>
                            {user.RealName}
                        </Select.Option>)}
                </Select>
            })
        }

        if (canBack) {
            var defaultChecked = this.state.isBack;
            items.push({
                title: '是否退回', name: 'IsBack', defaultValue: defaultChecked,
                render: <Checkbox defaultChecked={defaultChecked} onChange={e => this.setState({ isBack: e.target.checked })}>退回</Checkbox>
            });
        } else {
            items.push({ name: 'Result', defaultValue: true, render: <Input type="hidden" /> });
        }
        return items;
    }

    render() {
        const { children, flowData, record } = this.props;
        const model = record;
        const users = this.state.users || [];
        if (flowData == null || model == null) {
            return null;
        }

        return (
            <span>
                <FormModal
                    name="提交审批流程"
                    trigger={children}
                    children={this.getFormItems(model, flowData, users)}
                    onSubmit={this.handleSubmit}
                />
            </span>
        )
    }
}
export default FlowForm
