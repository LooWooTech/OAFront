import React, { Component } from 'react'
import { Select } from 'antd'
import api from '../../models/api'

class SelectUserComponent extends Component {
    state = {
        flowId: this.props.flowId,
        nodeId: this.props.nodeId,
        flowDataId: this.props.flowDataId,
        canComplete: this.props.canComplete
    }

    componentWillMount() {
        const { flowId, nodeId, flowDataId } = this.state
        this.loadUsers(flowId, nodeId, flowDataId);
    }

    loadUsers = (flowId, nodeId = 0, flowDataId = 0, searchKey = '') => {
        const parameters = {
            flowId, nodeId, flowDataId
        }
        api.FlowData.UserList(parameters, json => {
            const users = json.filter(e => e.RealName.indexOf(searchKey) > -1 || e.Username.indexOf(searchKey) > -1)
            this.setState({
                users: users,
                flowId, nodeId, flowDataId
            })
        })
    }

    handleChange = value => {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    handleSearch = value => {
        const { flowId, nodeId, flowDataId } = this.state
        this.loadUsers(flowId, nodeId, flowDataId, value)
    }

    componentWillReceiveProps(nextProps) {
        const { flowId, nodeId, flowDataId, canComplete } = this.props
        if (flowDataId !== this.state.flowDataId || nodeId !== this.state.nodeId) {
            this.loadUsers(flowId, nodeId, flowDataId, canComplete)
        }
    }


    render() {
        const { flowId, canComplete } = this.state
        if (!flowId) {
            return '缺少flowId参数';
        }
        if (canComplete) {
            return null;
        }
        const users = this.state.users || []

        return (
            <Select
                showSearch={true}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleChange}
                onSearch={this.handleSearch}>
                {users.map(user =>
                    <Select.Option key={user.ID}>
                        {user.RealName}
                    </Select.Option>)}
            </Select>
        )
    }
}

export default SelectUserComponent