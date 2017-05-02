import React, { Component } from 'react'
import { Select } from 'antd'
import api from '../../models/api'

class SelectUserComponent extends Component {
    state = {}

    componentWillMount() {
        const { flowId, nodeId, flowDataId } = this.props
        this.loadUsers(flowId, nodeId, flowDataId);
    }

    loadUsers = (flowId, nodeId = 0, flowDataId = 0) => {
        console.log(flowId);
        api.FlowData.UserList(flowId, nodeId, flowDataId, json => this.setState({ users: json }))
    }

    handleChange = value => {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        const { flowId, nodeId, flowDataId, canComplete } = this.props
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
                onSearch={value => this.loadUsers(flowId, nodeId, flowDataId, value)}>
                {users.map(user =>
                    <Select.Option key={user.ID}>
                        {user.RealName} - {user.Department}
                    </Select.Option>)}
            </Select>
        )
    }
}

export default SelectUserComponent