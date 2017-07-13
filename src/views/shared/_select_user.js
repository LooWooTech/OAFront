import React, { Component } from 'react';
import { Select, Button, Tabs, Tag, Tree, Input, Row, Col } from 'antd';
const TreeNode = Tree.TreeNode
import Modal from './_modal'
import api from '../../models/api'
import auth from '../../models/auth'

class SelectUser extends Component {
    state = { users: [], recents: [], selected: [], inModal: false }

    componentWillMount() {
        this.loadInitData();
    }

    componentWillReceiveProps(nextProps) {

    }

    loadInitData = () => {
        api.User.RecentList(json => {
            this.setState({ allRecents: json }, this.loadUsers)
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
        users = users.sort((a, b) => a.Sort > b.Sort)
        let key = this.state.key
        let titleId = this.state.titleId
        if (key) {
            users = users.filter(e => e.RealName.indexOf(key) > -1 || e.Username.indexOf(key) > -1)
        }
        if (titleId) {
            users = users.filter(e => e.JobTitleId === titleId)
        }
        let recents = [];
        users.map(user => {
            var any = (this.state.allRecents || []).find(e => e.ID === user.ID)
            if (any) {
                recents.push(user)
            }
            return user
        })
        this.setState({ recents, users })
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
        return departments;
    }

    getRootTreeNode = () => {
        let departments = this.getDepartments()
        //获取所有部门
        let root = { ID: 0, Name: '全员' }
        return this.getNodeTreeNode(root, departments)
    }

    getNodeTreeNode = (node, departments) => {
        let children = departments.filter(e => e.ParentId === node.ID)
        let users = this.state.users.filter(user => user.Departments.find(d => d.ID === node.ID))
            .sort((a, b) => a.Sort < b.Sort)
        return (
            <TreeNode key={'d_' + node.ID} title={node.Name} isLeaf={false}>
                {children.map(child => this.getNodeTreeNode(child, departments))}
                {users.map(user => <TreeNode title={user.RealName} key={user.ID} isLeaf={true} />)}
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
        let result = []
        //console.log
        this.state.users.map(user => {
            if (checkedKeys.find(id => user.ID.toString() === id)) {
                result.push(user)
            }
            return user
        })
        this.setState({ selected: result })
    }

    handleSelect = (checkedKeys, e) => {
        const multiple = this.props.formType === 'freeflow'
        if (multiple) {
            return false;
        }
        this.handleCheck(checkedKeys, e)
    }

    handleSubmit = () => {
        let users = this.getSelectedUsers()
        if (this.props.onSubmit)
            this.props.onSubmit(users)
    }

    render() {
        const { formType } = this.props
        const multiple = formType === 'freeflow'
        const users = this.state.users || []
        //如果不是查询结果
        if (!this.state.inModal) {
            if (users.length === 1) {
                let user = users[0]
                return <span>{user.RealName}</span>
            }

            if (users.length > 1 && users.length < 10) {
                return <Select mode={multiple ? 'multiple' : ''}
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
            title="选择人员"
            trigger={<Button>选择人员</Button>}
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
                <Tabs defaultActiveKey="1" style={{ height: '300px', overflow: 'auto', overflowX: 'hidden' }}>
                    <Tabs.TabPane tab="最近发送" key="1">
                        <Tree
                            multiple={multiple}
                            checkable={multiple}
                            onCheck={this.handleCheck}
                            onSelect={this.handleSelect}
                        >
                            {this.state.recents.map(user => <TreeNode key={user.ID} isLeaf={true} title={user.RealName} />)}
                        </Tree>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="全部人员" key="2">
                        <Tree multiple={multiple}
                            checkable={multiple}
                            defaultExpandedKeys={["d_0"]}
                            onCheck={this.handleCheck}
                            onSelect={this.handleCheck}
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
                            onSelect={this.handleCheck}
                        >
                            {this.getSelfDepartmentTreeNode()}
                        </Tree>
                    </Tabs.TabPane>
                </Tabs>
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <legend>所选人员</legend>
                    {this.state.selected.map(user => <Tag key={user.ID}>{user.RealName}</Tag>)}
                </div>

            </div>
            }
        />
    }
}

export default SelectUser;