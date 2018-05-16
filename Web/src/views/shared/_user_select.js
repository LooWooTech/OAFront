import React, { Component } from 'react';
import { Select, Button, Tabs, Tag, Tree, Input, Row, Col } from 'antd';
const TreeNode = Tree.TreeNode
import Modal from './_modal'
import FlowContactModal from '../user/_flow_contact_modal'
import api from '../../models/api'
import auth from '../../models/auth'


class UserSelect extends Component {
    state = {
        users: [],
        favorites: [],
        selected: this.props.defaultValue || [],
        length: this.props.length || 5,
        inModal: false,
        flowNodeId: this.props.flowNodeId || 0,
        flowDataId: this.props.flowDataId || 0,
        flowId: this.props.flowId || 0,
        flowStep: this.props.flowStep || 0,
        formType: this.props.formType,
        multiple: this.props.multiple || this.props.formType === 'freeflow'
    }

    componentWillMount() {
        this.loadInitData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.flowNodeId !== this.props.flowNodeId
            || nextProps.flowStep !== this.props.flowStep
        ) {
            this.setState({ flowNodeId: nextProps.flowNodeId }, this.loadUsers)
        }
    }


    loadInitData = () => {
        api.User.FlowContacts(json => {
            this.setState({ favorites: json }, this.loadUsers)
        })
        api.JobTitle.List(json => {
            this.setState({ titles: json })
        })
    }

    loadUsers = () => {
        let formType = this.props.formType
        if (formType === 'flow') {
            this.loadUsersForFlowData()
        }
        else if (formType === 'freeflow') {
            this.loadUsersForFreeFlowData()
        }
        else {
            this.loadAllUsers({ rows: 10000 })
        }
    }

    loadAllUsers = (parameter) => {
        api.User.List(parameter, json => {
            this.filterUsers(json.List)
        })
    }

    loadUsersForFlowData = () => {
        const { flowNodeId, flowDataId, flowId, flowStep } = this.state;

        api.FlowData.UserList({ flowNodeId, flowId, flowDataId, flowStep: flowStep || 1 }, json => {
            this.filterUsers(json)
        })
    }

    loadUsersForFreeFlowData = (key = '') => {
        const flowNodeDataId = this.props.flowNodeDataId;
        api.FreeFlowData.UserList(flowNodeDataId, '', json => {
            this.filterUsers(json)
        })
    }

    filterUsers = (users) => {
        users = users.sort((a, b) => b.Sort - a.Sort)
        let key = this.state.key
        let titleId = this.state.titleId
        if (key) {
            users = users.filter(e => e.RealName.indexOf(key) > -1 || e.Username.indexOf(key) > -1)
        }
        if (titleId) {
            users = users.filter(e => e.JobTitleId === titleId)
        }
        this.setState({ users })
    }

    getSelectedUsers = () => {
        let nullable = this.props.nullable || false
        if (nullable) {
            return this.state.selected || []
        }
        if (this.state.users.length === 1) {
            return this.state.users
        }
        return this.state.selected || []
    }

    getDepartments = () => {
        let departments = []
        let users = this.state.users
        users.map(user => user.Departments.map(d => {
            if (!departments.find(e => e.ID === d.ID)) {
                departments.push(d)
            }
            return d
        }))
        return departments.sort((a, b) => a.Sort - b.Sort);
    }

    getRootTreeNode = () => {
        let departments = this.getDepartments()
        //获取所有部门
        let root = { ID: 0, Name: '全部' }
        return this.getNodeTreeNode(root, departments)
    }

    getNodeTreeNode = (node, departments) => {
        let children = departments.filter(e => e.ParentId === node.ID).sort((a, b) => a.Sort - b.Sort)
        let users = this.state.users.filter(user => user.Departments.find(d => d.ID === node.ID));
        return (
            <TreeNode key={'d_' + node.ID} title={node.Name} isLeaf={false} disableCheckbox={!this.state.multiple}>
                {children.map(child => this.getNodeTreeNode(child, departments))}
                {users.sort((a, b) => b.Sort - a.Sort).map(user => <TreeNode
                    title={user.RealName}
                    key={user.ID}
                    isLeaf={true}
                />)}
            </TreeNode>
        )
    }

    getSelfDepartmentTreeNode = () => {
        let currentUser = auth.getUser()
        var departments = this.getDepartments()
        var currentDepartments = [];
        departments.map(d => {
            if (currentUser.DepartmentIds.find(id => id === d.ID)) {
                currentDepartments.push(d)
            }
            return d
        });

        const nodes = currentDepartments.map(node => (
            <TreeNode title={node.Name} key={'c_d_' + node.ID}>
                {this.state.users.filter(e => e.Departments.find(d => d.ID === node.ID)).map(user =>
                    <TreeNode title={user.RealName} key={user.ID} isLeaf={true} />)
                }
            </TreeNode>
        ))
        return this.state.multiple && currentDepartments.length > 1 ?
            <TreeNode key='root_self_department' title='全部' isLeaf={false}>
                {nodes}
            </TreeNode>
            : nodes;
    }

    getLeaderTreeNode = () => {
        const nodes = this.state.users
            .filter(e => e.JobTitleId === 3)
            .map(user => <TreeNode key={user.ID} isLeaf={true} title={user.RealName} />);
        return this.state.multiple ?
            <TreeNode key='root_leaders' title='全部' isLeaf={false} >
                {nodes}
            </TreeNode>
            : nodes;
    }

    getFavoritesTreeNode = () => {
        const nodes = this.state.favorites.map(user => {
            let disabled = !this.state.users.find(e => e.ID === user.ID);
            return <TreeNode key={user.ID} isLeaf={true} title={user.RealName} disabled={disabled} />
        })
        return this.state.multiple && nodes.length > 5 ?
            <TreeNode key='root_favorites' title='全部' isLeaf={false} >
                {nodes}
            </TreeNode>
            : nodes;
    }

    handleCheck = (checkedKeys, { checked, checkedNodes, node, event }) => {
        if (!checkedKeys || checkedKeys.length === 0) {
            this.setState({ selected: [] })
            return;
        }
        if (!checked) {
            let excludeIds = [];
            if (!node.props.isLeaf) {
                node.props.children.map(child => child.map(n => {
                    excludeIds.push(n.key)
                }));
            } else {
                excludeIds = [node.props.eventKey]
            }
            checkedKeys = checkedKeys.filter(id => !excludeIds.find(eId => id === eId))
        }
        if (this.state.multiple) {
            let result = []
            this.state.users.map(user => {
                if (checkedKeys.find(id => user.ID.toString() === id)) {
                    result.push(user)
                }
                return user
            })
            this.setState({ selected: result })
        }
        else {
            let currentKey = node.props.eventKey;
            let isLeaf = node.props.isLeaf;
            if (!isLeaf) return;
            let user = this.state.users.find(e => e.ID.toString() === currentKey)
            this.setState({ selected: [user] })
        }
    }

    handleSelect = (selectedKeys, e) => {
        this.handleCheck(selectedKeys, e)
    }

    getButtonText = (users) => {
        if (users.length > 0) {
            let text = '已选'
            for (var i = 0; i < this.state.length; i++) {
                if (i < users.length) {
                    text += ' ' + users[i].RealName;
                }
            }
            if (users.length > this.state.length) {
                text += ' 等' + users.length + '人';

            }
            return text;
        }
        else {
            return '请选择...'
        }
    }

    handleSubmit = () => {
        let users = this.getSelectedUsers()
        let btnText = this.getButtonText(users)
        this.setState({ buttonText: btnText })
        if (this.props.onSubmit)
            this.props.onSubmit(users)
    }

    handleAddFlowContact = () => {
        this.loadInitData();
    }

    handleRemoveSelectedUser = user => {
        let selected = this.state.selected.filter(e => e.ID !== user.ID) || [];
        this.setState({ selected });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props) || nextState !== this.state
    }

    render() {

        const multiple = this.state.multiple
        const users = this.state.users || []
        const selectedUsers = this.state.selected || [];
        const selectedUserIds = selectedUsers.map(user => user.ID.toString())

        //如果不是查询结果
        if (!this.state.inModal) {
            if (users.length === 1) {
                let user = users[0]
                return <span>{user.RealName}</span>
            }

            if (users.length > 1 && users.length < 10) {
                return <Select mode={multiple ? 'multiple' : ''} style={{ maxWidth: '200px' }}
                    onSelect={value => {
                        let userId = parseInt(value, 10)
                        let selectUser = this.state.users.find(e => e.ID === userId);
                        if (multiple) {
                            let list = selectedUsers || []
                            if (!list.find(user => user.ID === userId)) {
                                list.push(selectUser);
                            }
                            this.setState({ selected: list })
                        } else {
                            this.setState({ selected: [selectUser] })
                        }
                    }}
                    onDeselect={value => {
                        let userId = parseInt(value, 10)
                        let list = selectedUsers.filter(user => user.ID !== userId)
                        this.setState({ selected: list })
                    }}
                >
                    {users.map(user =>
                        <Select.Option key={user.ID}>
                            {user.RealName}
                        </Select.Option>)}
                </Select>
            }
        }

        return <Modal
            title={this.props.title || "选择人员"}
            trigger={<Button>{this.getButtonText(selectedUsers)}</Button>}
            onSubmit={this.handleSubmit}
            style={{ width: '50%' }}
            children={<div>
                <Row>
                    <Col span={12}>
                        <Input.Search placeholder="请输入查询姓名" onSearch={key => {
                            this.setState({ key, titleId: 0, inModal: true }, this.loadUsers)
                        }} />
                    </Col>
                    <Col span={12}>
                        <Select
                            placeholder="按职务筛选"
                            style={{ width: '100%' }}
                            onSelect={value => {
                                this.setState({ key: '', titleId: parseInt(value || '0', 10), inModal: true }, this.loadUsers)
                            }}
                        >
                            {(this.state.titles || []).map(t => <Select.Option key={t.ID}>{t.Name}</Select.Option>)}
                        </Select>
                    </Col>
                </Row>
                <Tabs
                    defaultActiveKey="0"
                    style={{ height: '280px', overflow: 'auto', overflowX: 'hidden' }}
                >
                    <Tabs.TabPane tab="常用" key="0">
                        <Tree multiple={multiple}
                            checkable={multiple}
                            onCheck={this.handleCheck}
                            onSelect={this.handleSelect}
                            checkedKeys={selectedUserIds}
                            selectedKeys={selectedUserIds}
                        >
                            {this.getFavoritesTreeNode()}
                        </Tree>
                        <FlowContactModal onSubmit={this.handleAddFlowContact} />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="全部人员" key="2">
                        <Tree multiple={multiple}
                            checkable={multiple}
                            defaultExpandedKeys={["d_0"]}
                            onCheck={this.handleCheck}
                            onSelect={this.handleSelect}
                            checkedKeys={selectedUserIds}
                            selectedKeys={selectedUserIds}
                        >
                            {this.getRootTreeNode()}
                        </Tree>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="本部门" key="3" >
                        <Tree
                            multiple={multiple}
                            checkable={multiple}
                            defaultExpandAll={true}
                            onCheck={this.handleCheck}
                            onSelect={this.handleSelect}
                            checkedKeys={selectedUserIds}
                            selectedKeys={selectedUserIds}
                        >
                            {this.getSelfDepartmentTreeNode()}
                        </Tree>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="负责人" key="4">
                        <Tree
                            multiple={multiple}
                            checkable={multiple}
                            onSelect={this.handleSelect}
                            onCheck={this.handleCheck}
                            checkedKeys={selectedUserIds}
                            selectedKeys={selectedUserIds}
                            defaultExpandAll={true}
                        >
                            {this.getLeaderTreeNode()}
                        </Tree>
                    </Tabs.TabPane>
                </Tabs>
                <div style={{ maxHeight: '100px', overflow: 'auto' }}>
                    <legend>所选人员</legend>
                    {selectedUsers.map(user => <Tag key={user.ID} closable={true} afterClose={() => this.handleRemoveSelectedUser(user)}>{user.RealName}</Tag>)}
                </div>

            </div>
            }
        />
    }
}

export default UserSelect;