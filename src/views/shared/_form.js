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
        const style = this.props.style || {}
        const formItemLayout = this.props.itemLayout || {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const layout = this.props.layout || 'horizontal'

        const { getFieldDecorator } = this.props.form;
        const getControl = item => {
            var getField = true
            if (item.getField === false) getField = false
            if (!item.name) getField = false
            let fieldParameter = {}
            if (item.defaultValue)
                fieldParameter.initialValue = item.defaultValue;
            if (item.rules)
                fieldParameter.rules = item.rules

            return getField ?
                getFieldDecorator(item.name, fieldParameter)(item.render)
                : item.render;
        }
        const getLabel = item => {
            if (item.tips) {
                return <Tooltip title={item.tips}><Icon type="question-circle" /> {item.title} </Tooltip>
            }
            return item.title
        }
        return (
            <Form layout={layout} onSubmit={this.handleSubmit} style={style}>
                {children.map((item, key) =>
                    item.title ?
                        <Form.Item
                            key={item.name || key}
                            label={getLabel(item)}
                            extra={item.extra}
                            {...(item.layout ? item.layout : formItemLayout) }
                        >
                            {item.before ? <span>{item.before}&nbsp;</span> : null}
                            {getControl(item)}
                            {item.after ? <span>&nbsp;{item.after}</span> : null}
                            </Form.Item>
                        : <span key={item.name || key}>{item.before} {getControl(item)} {item.after}</span>
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