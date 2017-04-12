import React, { Component } from 'react'
import { Modal, Select, message } from 'antd'
import api from '../../models/api';

class SelectUserModal extends Component {
    state = { selected: 0, result: true, users: [] }

    componentWillMount() {
        let infoId = this.props.infoId;
        let nodeId = this.props.nodeId;
        api.FlowData.UserList(this, infoId, nodeId, data => {
            this.setState({ users: data || [] })
        });
    }

    handleOk = () => {
        const onOk = this.props.onOk;
        if (this.state.selected === 0) {
            message.error('请选择一位用户');
            return;
        }
        onOk(this.state.selected, true);
        this.setState({ visible: false });
    };
    handleChange = value => {
        this.setState({ selected: value })
    };
    handleSubmit = () => {
        //判断是否完结，如果完结，则不弹出窗口，直接提交
        let dataId = this.props.dataId;
        let nodeId = this.props.nodeId;
        api.FlowData.CanComplete(this, dataId, nodeId, result => {
            if (!result) {
                this.setState({ visible: true });
            } else {
                const onOk = this.props.onOk;
                onOk(0, true);
            }
        });
    };
    render() {
        const children = this.props.children;

        return (
            <span>
                <span onClick={this.handleSubmit}>
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
                                    {user.RealName}
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