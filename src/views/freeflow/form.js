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
        api.FreeFlowData.UserList(flowNodeData.ID, '', json => {
            var treeData = [];
            var list = json
            if (key) {
                list = list.filter(e => e.RealName.indexOf(key) > -1 || e.Username.indexOf(key) > -1)
            }
            list.map(user => user.Departments.map(d => {
                var item = treeData.find(e => e.value === 'parent' + d.ID);
                if (!item) {
                    item = { value: 'parent' + d.ID, label: d.Name, selectable: false, children: [] }
                    treeData.push(item);
                }
                item.children.push({ value: user.ID.toString(), label: user.RealName })
                return d;
            }));
            this.setState({ treeData })
        })
    }

    handleSubmit = (data) => {
        var toUserIds = (data.ToUsers || []).join()
        api.FreeFlowData.Submit(data.FlowNodeDataID, toUserIds, data, json => {
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
            { name: 'FlowNodeDataID', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'FreeFlowDataId', defaultValue: flowNodeData.ID, render: <Input type="hidden" /> },
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
        ]
        //如果当前是节点发起人第一次发给别人，则不需要填写content
        if (flowNodeData.FreeFlowData) {
            items.push({
                title: '意见', name: 'Content', defaultValue: model.Content,
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            })
        }
        items.push({
            title: '选择发送人',
            tips: '选择发送人，则表示将此条数据提交给他人审阅；不选择代表当前审阅结束',
            name: 'ToUsers',
            render:
            <TreeSelect
                placeholder="可以不选择发送人"
                showSearch={true}
                allowClear={true}
                multiple={true}
                treeCheckable={true}
                filterTreeNode={(val, node) => node.props.title.indexOf(val) > -1}
                treeData={this.state.treeData}
                treeDefaultExpandedKeys={['0']}
            />
        })

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
