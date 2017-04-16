import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import api from '../../models/api';
const FormItem = Form.Item;

class NodeEditForm extends Component {

    state = {
        visible: false,
        users: []
    };

    onSearchChange = (value) => {
        if (!value) return;
        api.User.List(this, { searchKey: value }, json => {
            this.setState({ users: json.List });
        });
    };


    componentWillMount() {
        //显示的时候绑定默认的受理人
        let record = this.props.record;
        if (record.User) {
            this.setState({
                users: [
                    { ID: record.User.ID, Username: record.User.Username }
                ]
            })
        }
    };

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({ visible: true, });
    };

    hideModelHandler = () => {
        this.setState({ visible: false, });
    };

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(err, values);
                this.hideModelHandler();
            }
        });
    }

    render() {
        const { children, departments, groups } = this.props;
        const { getFieldDecorator } = this.props.form;
        const model = this.props.record || {};
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const nodes = this.props.nodes || [];

        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal title={model.ID ? '编辑流程结点' : '新建流程结点'}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModelHandler}
                >
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        {getFieldDecorator('ID', {
                            initialValue: model.ID
                        })(<Input type="hidden" />)}
                        {getFieldDecorator('Step', {
                            initialValue: model.Step,
                        })(<Input type="hidden" />)}
                        {getFieldDecorator('FlowId', {
                            initialValue: model.FlowId
                        })(<Input type="hidden" />)}
                        <FormItem {...formItemLayout} label="名称" >
                            {getFieldDecorator('Name', {
                                initialValue: model.Name,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="前一节点" >
                            {getFieldDecorator('PrevId', {
                                initialValue: (model.PrevId || '').toString(),
                            })(
                                <Select notFoundContent="无" >
                                    {nodes.map((node, key) => <Select.Option
                                        key={node.ID}
                                        disabled={node.ID === model.ID}>
                                        {node.Name}</Select.Option>)}
                                </Select>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="受理人" >
                            {getFieldDecorator('UserId', {
                                initialValue: (model.UserId || '').toString(),
                            })(
                                <Select
                                    combobox
                                    showSearch={true}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchChange}
                                    placeholder="请输入姓名"
                                    optionLabelProp="children"
                                >
                                    {this.state.users.map((item, key) =>
                                        <Select.Option key={key} value={(item.ID || '').toString()}>
                                            {item.RealName}
                                        </Select.Option>)}
                                </Select>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="受理部门">
                            {getFieldDecorator('DepartmentId', {
                                initialValue: (model.DepartmentId || '').toString(),
                            })(
                                <Select>
                                    <Select.Option key={0}>无</Select.Option>
                                    {departments.map((item, key) =>
                                        <Select.Option key={item.ID} title={item.Name}>
                                            {item.Name}
                                        </Select.Option>)}
                                </Select>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="受理用户组">
                            {getFieldDecorator('GroupId', {
                                initialValue: (model.GroupId || '').toString(),
                            })(
                                <Select>
                                    <Select.Option key={0}>无</Select.Option>
                                    {groups.map((item, key) =>
                                        <Select.Option key={item.ID}>
                                            {item.Name}
                                        </Select.Option>)}
                                </Select>
                                )}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(NodeEditForm);