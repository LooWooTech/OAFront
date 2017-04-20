import React, { Component } from 'react';
import { Modal, Form } from 'antd';

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
        const { children, trigger } = this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { getFieldDecorator } = this.props.form;

        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {trigger}
                </span>
                <Modal title={this.props.name || ''}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModelHandler}
                >
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        {children.map((item, key) =>
                            item.title ? <Form.Item key={key} label={item.title} {...(item.layout ? item.layout : formItemLayout) }>
                                {getFieldDecorator(item.name, { initialValue: item.defaultValue })(item.render)}
                            </Form.Item>
                                : <span key={key}>{getFieldDecorator(item.name, { initialValue: item.defaultValue })(item.render)}</span>
                        )}
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(DepartmentEditForm);