import React, { Component } from 'react'
import { Modal, message } from 'antd'
import Form from './_form'

class SharedFormModal extends Component {
    state = { visible: false, }
    showModelHandler = (e) => {
        if (e) e.stopPropagation()
        this.setState({ visible: true, })
    }
    hideModelHandler = () => {
        this.setState({ visible: false, })
    }
    handleSubmit = () => {
        this.refs.form.validateFields((errs, values) => {
            if (errs) {
                message.error(errs);
            } else {
                if (this.props.onSubmit(values) !== false) {
                    this.hideModelHandler();
                }
            }
        });
    }
    render() {
        const { children, trigger } = this.props
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
                    <Form
                        ref="form"
                        onSubmit={this.handleSubmit}
                        children={children}
                    />
                </Modal>
            </span>
        )
    }
}
SharedFormModal.propTypes = {
    trigger: React.PropTypes.element.isRequired,
    children: React.PropTypes.array.isRequired,
    onSubmit: React.PropTypes.func.isRequired
}
export default SharedFormModal