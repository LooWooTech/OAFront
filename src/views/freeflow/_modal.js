import React, { Component } from 'react'
import Form from './_form'
import Modal from '../shared/_modal'

class FreeFlowFormModal extends Component {
    state = {}
    handleSubmit = () => {
        this.refs.form.submit(data => {
            console.log(this.props.onSubmit)
            if (this.props.onSubmit) {
                this.props.onSubmit(data)
            }
        });

    }

    render() {
        const { flowNodeData } = this.props
        if (!flowNodeData) return null
        //if (this.state.treeData.length === 0) return null;
        return (
            <Modal
                title={this.props.title || '提交自由流程'}
                children={<Form {...this.props}
                    ref="form"
                    itemLayout={{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}
                    onSubmit={this.handleSubmit}
                />}
                trigger={this.props.trigger}
                onSubmit={this.handleSubmit}
            />

        )
    }
}
export default FreeFlowFormModal
