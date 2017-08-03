import React, { Component } from 'react'
import { TreeSelect } from 'antd'
import api from '../../models/api'
const TreeNode = TreeSelect.TreeNode
class DepartmentSelectTree extends Component {

    state = { list: [] }

    componentWillMount() {
        api.Department.List(json => {
            this.setState({ list: json })
        })
    }

    getTreeNode = (node) => <TreeNode key={node.ID} value={node.ID.toString()} title={node.Name}>
        {this.state.list.filter(e => e.ParentId === node.ID).map(item => this.getTreeNode(item))}
    </TreeNode>

    render() {

        return (
            <TreeSelect {...this.props}>
                {this.state.list.filter(e => e.ParentId === 0).map(item => this.getTreeNode(item))}
            </TreeSelect>
        )
    }
}

export default DepartmentSelectTree