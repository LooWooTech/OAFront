import React, { Component } from 'react'
import { Button, AutoComplete, message } from 'antd'
import api from '../../models/api'
import Modal from '../shared/_formmodal'
class FlowContactEditModal extends Component {

    state = { users: [], selected: {} }

    handleSearch = (key) => {
        api.User.List({ searchKey: key }, json => this.setState({ users: json.List }))
    }

    handleSelect = (value) => {
        let selected = this.state.users.find(e => e.ID === parseInt(value, 10));
        this.setState({ selected })
    }

    handleSubmit = () => {
        let userId = this.state.selected.ID || 0;
        if (!userId) {
            message.error('没有选择任何人');
            return false;
        }
        api.User.AddFlowContact(userId, () => {
            if (this.props.onSubmit) {
                this.props.onSubmit(this.state.selected)
            }
        });
    }

    render() {
        return (
            <Modal
                title="添加联系人"
                trigger={this.props.trigger || <Button>添加联系人</Button>}
                onSubmit={this.handleSubmit}
                children={[
                    {
                        title: '联系人', name: 'UserId',
                        render: <AutoComplete
                            placeholder="请输入姓名"
                            allowClear={true}
                            onSearch={this.handleSearch}
                            onSelect={this.handleSelect}
                        >
                            {this.state.users.map(e => <AutoComplete.Option key={e.ID}>{e.RealName}</AutoComplete.Option>)}
                        </AutoComplete>
                    }
                ]}
            />
        )
    }
}

export default FlowContactEditModal