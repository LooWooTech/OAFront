import React, { Component } from 'react'
import { Input, TreeSelect, message } from 'antd'
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class FreeFlowForm extends Component {
    state = { treeData: [] }
    componentWillMount() {
        this.loadUsers()
    }

    loadUsers = (key = '') => {
        const flowNodeData = this.props.flowNodeData;
        const record = this.props.record || {};
        api.FreeFlowData.UserList(flowNodeData.ID, '', json => {
            var treeData = [];
            if (key) {
                json = json.filter(e => e.RealName.indexOf(key) > -1);
            }
            json.map(user => user.Departments.map(d => {
                var item = treeData.find(e => e.value === 'parent' + d.ID);
                if (!item) {
                    item = { value: 'parent' + d.ID, label: d.Name, selectable: false, children: [] }
                }
                item.children.push({ value: user.ID.toString(), label: user.RealName })
                treeData.push(item);
                return d;
            }));
            console.log(treeData);
            let parent = flowNodeData.Nodes.find(e => e.ID === record.ParentId)
            if (parent) {
                treeData.splice(0, 0, {
                    value: '0', label: '默认', selectable: false, children: [{ value: parent.UserId.toString(), label: parent.Signature }]
                });
            }
            this.setState({ treeData })
        })
    }

    handleSubmit = (data) => {
        if (!data.ToUsers || data.ToUsers.length === 0) {
            message.error("请选择要发送的人")
            return false
        }
        var toUserIds = data.ToUsers.join()
        api.FreeFlowData.Submit(toUserIds, data, json => {
            message.success("提交成功")
            const callback = this.props.callback
            if (callback) {
                callback(json)
            }
        })
    }
    getFormItems = (flowNodeData) => {
        const model = this.props.record || {}
        var items = [
            { name: 'InfoId', defaultValue: this.props.infoId, render: <Input type="hidden" /> },
            { name: 'FlowNodeDataId', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            {
                title: '选择发送人',
                name: 'ToUsers',
                render:
                <TreeSelect
                    showSearch={true}
                    allowClear={true}
                    multiple={true}
                    treeCheckable={true}
                    treeData={this.state.treeData}
                    treeDefaultExpandedKeys={['0']}
                />
            },
        ]
        //如果当前是节点发起人第一次发给别人，则不需要填写content
        if (flowNodeData.Nodes.length > 0) {
            items.push({
                title: '意见', name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            })
        }
        return items
    }
    render() {
        const { flowNodeData } = this.props
        if (!flowNodeData) return null
        //if (this.state.treeData.length === 0) return null;
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
