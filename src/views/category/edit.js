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
        const { children, record, parent } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal title={record ? '修改分类' : (parent ? '添加子类' : '添加分类')}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModelHandler}
                >
                    <Form horizontal onSubmit={this.handleSubmit}>
                        {
                            getFieldDecorator('ID', {
                                initialValue: (record ? record.ID : 0)
                            })(<Input type="hidden" />)
                        }
                        {
                            getFieldDecorator('ParentID', {
                                initialValue: parent ? parent.ID : 0,
                            })(<Input type="hidden" />)
                        }
                        {
                            parent ? <FormItem {...formItemLayout} label="上级分类" >
                                <Input defaultValue={parent.Name} />
                            </FormItem> : ''
                        }
                        <FormItem {...formItemLayout} label="分组名称" >
                            {
                                getFieldDecorator('name', {
                                    initialValue: (record ? record.Name : ''),
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