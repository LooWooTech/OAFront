import React, { Component } from 'react'
import Modal from '../shared/_modal'
import Form from './_form'
class FlowNodeDataModal extends Component {
    state = {}

    handleSubmit = () => {
        this.refs.form.submit(data => {
            if (this.props.onSubmit) {
                this.props.onSubmit(data)
            }
        });

    }

    render() {

        const { flowData } = this.props
        if (flowData && flowData.Completed) return null;

        return <Modal
            title={this.props.title || '提交流程'}
            children={<Form {...this.props}
                ref="form"
                itemLayout={{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}
                isModal={true}
            />}
            onSubmit={this.handleSubmit}
            trigger={this.props.trigger}
        />
    }
}
export default FlowNodeDataModal
