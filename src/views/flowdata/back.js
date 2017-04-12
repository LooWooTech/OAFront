import React, { Component } from 'react'
import { Modal, Radio, message } from 'antd'
import api from '../../models/api';

class SelectUserModal extends Component {
    state = { selected: 0, list: [] }

    componentWillMount() {
        let infoId = this.props.infoId;
        let backId = this.props.nodeId;
        api.FlowData.BackList(this, infoId, backId, data => {
            this.setState({ list: data || [] })
        });
    }

    handleOk = () => {
        const onOk = this.props.onOk;
        if (this.state.selected === 0) {
            message.error('请选择一个流程节点');
            return;
        }
        onOk(this.state.selected, this.props.result);
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
                    title="选择退回流程"
                    width={240}
                    height={400}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <div>
                        <Radio.Group onChange={this.handleChange}>
                            {this.state.list.map((item, key) =>
                                <Radio key={key} value={item.ID}>
                                    {item.Name} - {item.Signature} - {item.Department}
                                </Radio>
                            )}
                        </Radio.Group>
                    </div>
                </Modal>
            </span>
        )
    }
}

export default SelectUserModal