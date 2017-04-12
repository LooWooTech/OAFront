import React, { Component } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import SelectUserModal from './users';
import SelectBackModal from './back';
import api from '../../models/api';

class SubmitForm extends Component {
    state = { visible: false, };
    handleSubmit = (selectedUserId, result) => {
        let data = this.props.form.getFieldsValue();
        data.Result = result;
        api.FlowData.Submit(this, selectedUserId, data.InfoId, data, json => {

        });
    };

    showModal = () => {
        this.setState({ visible: true });
    };

    render() {
        let { children, canSubmit, info } = this.props;
        if (info == null) {
            return null;
        }
        const nodedata = this.props.nodedata || {};
        const { getFieldDecorator } = this.props.form;
        const canBack = info.FlowDataId > 0 && info.FlowData.Nodes.length > 1 && nodedata.Result === null;
        return (
            <span>
                <span onClick={this.showModal}>
                    {children}
                </span>
                <Modal title="提交流程"
                    visible={this.state.visible}
                    onCancel={() => this.setState({ visible: false })}
                    footer={<div>
                        {canSubmit ?
                            <SelectUserModal
                                infoId={info.ID || 0}
                                onOk={this.handleSubmit}
                                nodeId={nodedata.FlowNodeId || 0}
                                dataId={info.FlowDataId}
                                children={<Button type="primary" icon="check" htmlType="button">同意</Button>}
                            /> : null}
                        {canBack ?
                            <SelectBackModal
                                infoId={info.ID || 0}
                                onOk={this.handleSubmit}
                                nodeId={nodedata.FlowNodeId || 0}
                                children={<Button type="danger" icon="rollback" htmlType="button">退回</Button>}
                            /> : null}
                    </div>}
                >
                    <Form layout="horizontal" onSubmit={this.handlerSubmit} disabled={!canSubmit}>
                        {getFieldDecorator("ID", { initialValue: nodedata.ID })(<Input type="hidden" />)}
                        {getFieldDecorator("InfoId", { initialValue: info.ID })(<Input type="hidden" />)}
                        {getFieldDecorator("FlowNodeId", { initialValue: info.FlowNodeId })(<Input type="hidden" />)}
                        {getFieldDecorator("FlowDataId", { initialValue: info.FlowDataId })(<Input type="hidden" />)}
                        <Form.Item label="意见" >
                            {getFieldDecorator("Content", { initialValue: nodedata.Content })(
                                <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
                            )}
                        </Form.Item>

                    </Form>
                </Modal>
            </span>
        )
    }
}
export default Form.create()(SubmitForm)
