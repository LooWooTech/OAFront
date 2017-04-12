import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class DepartmentEditForm extends Component {

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
        const { children } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { ID, Name } = this.props.record || {};
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal title={ID ? '编辑用户组' : '新建用户组'}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModelHandler}
                >
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        {
                            getFieldDecorator('ID', {
                                initialValue: ID
                            })(<Input type="hidden" />)
                        }
                        <FormItem {...formItemLayout} label="分组名称" >
                            {
                                getFieldDecorator('name', {
                                    initialValue: Name,
                                })(<Input />)
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(DepartmentEditForm);