import React, { Component } from 'react';
import { Select, Button, Tabs, Tag, Tree, Input, Row, Col } from 'antd';
const TreeNode = Tree.TreeNode
import Modal from './_modal'
import FlowContactModal from '../user/_flow_contact_modal'
import api from '../../models/api'
import auth from '../../models/auth'


class UserSelect extends Component {
    state = {
        users: [], favorites: [], selected: [], inModal: false,
        multiple: this.props.multiple || this.props.formType === 'freeflow'
    }

    componentWillMount() {
        this.loadInitData();
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
        const flowNodeDataId = this.props.flowNodeDataId || 0;
        const flowId = this.props.flowId || 0;
        const flowStep = this.props.flowStep || 1;

        api.FlowData.UserList({ flowNodeDataId, flowId, flowStep }, json => {
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
            return this.state.selected
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
        let root = { ID: 0, Name: '全员' }
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


        return currentDepartments.map(node => <TreeNode title={node.Name} key={'c_d_' + node.ID}>
            {this.state.users.filter(e => e.Departments.find(d => d.ID === node.ID)).map(user =>
                <TreeNode title={user.RealName} key={user.ID} isLeaf={true} />)
            }
        </TreeNode>)
    }

    handleCheck = (checkedKeys, e) => {
        if (!checkedKeys || checkedKeys.length === 0) {
            this.setState({ selected: [] })
            return;
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
            let currentKey = e.node.props.eventKey;
            let isLeaf = e.node.props.isLeaf;
            if (!isLeaf) return;
            let user = this.state.users.find(e => e.ID.toString() === currentKey)
            this.setState({ selected: [user] })
        }
    }

    handleSelect = (selectedKeys, e) => {
        this.handleCheck(selectedKeys, e)
    }

    handleSubmit = () => {
        let users = this.getSelectedUsers()
        if (users.length > 0) {
            let text = '已选 ' + users[0].RealName;
            if (users.length > 1) {
                text += ' 等' + users.length + '人';
            }
            this.setState({ buttonText: text })
        }
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

    render() {
        const multiple = this.state.multiple
        const users = this.state.users || []
        const defaultSelectedKeys = this.state.selected.map(user => user.ID.toString())
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
                            let list = this.state.selected || []
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
                        let list = (this.state.selected || []).filter(user => user.ID !== userId)
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
            trigger={<Button>{this.state.buttonText || '选择...'}</Button>}
            onSubmit={this.handleSubmit}
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
                    style={{ height: '300px', overflow: 'auto', overflowX: 'hidden' }}
                    tabBarExtraContent={<FlowContactModal onSubmit={this.handleAddFlowContact} />}
                >
                    <Tabs.TabPane tab="常用联系人" key="0">
                        <Tree multiple={multiple}
                            checkable={multiple}
                            onCheck={this.handleCheck}
                            onSelect={this.handleSelect}
                            checkedKeys={defaultSelectedKeys}
                            selectedKeys={defaultSelectedKeys}
                        >
                            {this.state.favorites.map(user => {
                                let disabled = !this.state.users.find(e => e.ID === user.ID);
                                return <TreeNode key={user.ID} isLeaf={true} title={user.RealName} disabled={disabled} />
                            })}
                        </Tree>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="全部人员" key="2">
                        <Tree multiple={multiple}
                            checkable={multiple}
                            defaultExpandedKeys={["d_0"]}
                            onCheck={this.handleCheck}
                            onSelect={this.handleSelect}
                            checkedKeys={defaultSelectedKeys}
                            selectedKeys={defaultSelectedKeys}
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
                            checkedKeys={defaultSelectedKeys}
                            selectedKeys={defaultSelectedKeys}
                        >
                            {this.getSelfDepartmentTreeNode()}
                        </Tree>
                    </Tabs.TabPane>
                </Tabs>
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <legend>所选人员</legend>
                    {this.state.selected.map(user => <Tag key={user.ID} closable={true} afterClose={() => this.handleRemoveSelectedUser(user)}>{user.RealName}</Tag>)}
                </div>

            </div>
            }
        />
    }
}

export default UserSelect;