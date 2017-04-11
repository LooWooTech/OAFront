import React, { Component } from 'react'
import { Modal, Button, Select, message } from 'antd'
import api from '../../models/api';

class SelectUserModal extends Component {
    state = { selected: 0, result: true, users: [] }

    componentWillMount() {
        let infoId = this.props.infoId;
        let nodeId = this.props.nodeId;
        let result = this.props.result;
        api.FlowData.UserList(this, infoId, nodeId, result, data => {
            this.setState({ users: data || [] })
        });
    }

    handleOk = () => {
        const onOk = this.props.onOk;
        if (this.state.selected === 0) {
            message.error('请选择一位用户');
            return;
        }
        onOk(this.state.selected);
        this.setState({ visible: false });
    };
    handleChange = value => {
        this.setState({ selected: value })
    }
    render() {
        const children = this.props.children;

        return (
            <span>
                <span onClick={() => this.setState({ visible: true })}>
                    {children}
                </span>
                <Modal
                    title="选择接收人"
                    width={240}
                    height={400}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <div>
                        <Select showSearch
                            onChange={this.handleChange}
                            style={{ width: 200 }}
                            placeholder="选择一个人"
                        >
                            {this.state.users.map((user, key) =>
                                <Select.Option key={key} value={user.ID.toString()}>
                                    {user.Username}
                                </Select.Option>
                            )}
                        </Select>
                    </div>
                </Modal>
            </span>
        )
    }
}

export default SelectUserModal