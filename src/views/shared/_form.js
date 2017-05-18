import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Tooltip, Icon } from 'antd'

class SharedForm extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err);
                return false;
            }
            this.props.onSubmit(values);
        })
    }

    render() {
        const children = this.props.children || [];

        const formItemLayout = this.props.layout || {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { getFieldDecorator } = this.props.form;
        const getControl = item => {
            var getField = true
            if (item.getField === false) getField = false
            if (!item.name) getField = false
            return getField ?
                getFieldDecorator(item.name, { initialValue: item.defaultValue, rules: item.rules || [] }, )(item.render)
                : item.render;
        }
        const getLabel = item => {
            if (item.tips) {
                return <Tooltip title={item.tips}>{item.title}<Icon type="question-circle" /></Tooltip>
            }
            return item.title
        }
        return (
            <Form layout="horizontal" onSubmit={this.handleSubmit}>
                {children.map((item, key) =>
                    item.title ?
                        <Form.Item key={item.name || key} label={getLabel(item)} {...(item.layout ? item.layout : formItemLayout) }>
                            {getControl(item)}
                        </Form.Item>
                        : <span key={item.name || key}>{getControl(item)}</span>
                )}
            </Form>
        )
    }
}
SharedForm.propTypes = {
    children: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
}
export default Form.create()(SharedForm);