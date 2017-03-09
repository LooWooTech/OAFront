import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;

class UserEditForm extends Component {

    state = { visible: false, };

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

        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal title={model.ID ? '修改用户' : '添加用户'}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModelHandler}
                >
                    <Form horizontal onSubmit={this.handleSubmit}>
                        {
                            getFieldDecorator('ID', {
                                initialValue: model.ID
                            })(<Input type="hidden" />)
                        }
                        <FormItem {...formItemLayout} label="用户名" >
                            {
                                getFieldDecorator('name', {
                                    initialValue: model.Name,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="姓名" >
                            {
                                getFieldDecorator('username', {
                                    initialValue: model.Username,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="密码" >
                            {
                                getFieldDecorator('password', {

                                })(<Input type="password" />)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="所属部门">
                            {
                                getFieldDecorator('departmentId', {
                                    initialValue: model.DepartmentID
                                })(<Select>
                                    {departments.map((item,key) => <Select.Option key={item.ID} value={item.ID}>{item.Name}</Select.Option>)}
                                </Select>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="所属分组">
                            {
                                getFieldDecorator('groupIds', {
                                    initialValue: model.GroupIds
                                })(<Select multiple>
                                    {groups.map((item,key) => <Select.Option key={item.ID} value={item.ID}>{item.Name}</Select.Option>)}
                                </Select>)
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(UserEditForm);