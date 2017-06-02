import React, { Component } from 'react';
import { Timeline, Icon, Tree, Popover, Tag } from 'antd';
const TreeNode = Tree.TreeNode
import moment from 'moment';

class FlowDataList extends Component {

    getContent = content => content ? content.split('\n').map((str, key) => <span key={key}>{str}<br /></span>) : null;

    getFreeList = freeflowData => {
        let nodes = freeflowData.Nodes.filter(e => e.ParentId === 0)
        return (
            <div className="sub-timeline">
                <Tree>
                    {nodes.map(node => this.getTreeNode(node, freeflowData.Nodes))}
                </Tree>

            </div>)
    }

    getTreeNode = (node, list) => {
        let children = list.filter(e => e.ParentId === node.ID)
        let treeNodeTitle = <Popover
            title={node.UpdateTime ? moment(node.UpdateTime).format('YYYY-MM-DD HH:mm') : ''}
            content={node.Content || node.UpdateTime ? '阅' : ''}
            trigger="hover">
            <Tag color={node.UpdateTime ? 'green' : ''}>{node.Signature}</Tag>
        </Popover>
        if (children && children.length > 0) {
            return <TreeNode title={treeNodeTitle} key={node.ID}>
                {children.map(child => this.getTreeNode(child, list))}
            </TreeNode>
        }
        else {
            return <TreeNode title={treeNodeTitle} key={node.ID} />
        }
    }

    render() {
        const model = this.props.data;
        if (!model) return null;
        const list = model.Nodes;
        if (list == null || list.length === 0) {
            return <span>流程尚未开始</span>;
        }
        return (
            <div style={{ padding: '20px', marginLeft: '20px' }}>
                <Timeline>
                    {list.sort((a, b) => a.ID > b.ID).map(item => {
                        var color = item.Result === true ? 'green' : (item.Result === false ? 'red' : 'blue');
                        var icon = color === 'green' ? 'check' : color === 'red' ? 'close' : 'clock-circle-o';
                        return <Timeline.Item dot={<Icon type={icon} style={{ fontSize: '1rem' }} />} color={color} key={item.ID}>
                            <span className="flownode-sign">{item.Signature}</span>
                            （<span className="flownode-name">{item.FlowNodeName}</span>）
                        <span className="flownode-datetime">{item.UpdateTime ? moment(item.UpdateTime).format('YYYY-MM-DD HH:mm') : ''}</span>
                            <div className="flownode-content">{this.getContent(item.Content)}</div>
                            {item.FreeFlowData ? this.getFreeList(item.FreeFlowData) : null}
                        </Timeline.Item>
                    })}
                </Timeline>
            </div>
        )
    }
}

export default FlowDataList