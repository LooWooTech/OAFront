import React, { Component } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import SelectUserModal from './users';

class SubmitForm extends Component {
    state = { visible: false, };
    handleSubmit = (selectedUserId) => {
        let data = this.props.form.getFieldsValue();
        //把data传给 选择人员选择框
        console.log(selectedUserId);
        console.log(data);
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
        const canBack = info.FlowDataId > 0 && info.FlowData.Nodes.length > 1 && nodedata.result === null;
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
                                result={true}
                                children={<Button type="primary" icon="check" htmlType="button">同意</Button>}
                            /> : null}
                        {canBack ?
                            <SelectUserModal
                                infoId={info.ID || 0}
                                onOk={this.handleSubmit}
                                nodeId={nodedata.FlowNodeId || 0}
                                result={false}
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
