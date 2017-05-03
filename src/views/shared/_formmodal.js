import React, { Component } from 'react'
import { Modal } from 'antd'
import PropTypes from 'prop-types'
import SharedForm from './_form'

class SharedFormModal extends Component {
    state = { visible: false }
    showModal = (e) => {
        if (e) e.stopPropagation()
        this.setState({ visible: true, })
    }
    hideModal = () => {
        this.setState({ visible: false, })
    }
    handleSubmit = () => {
        var form = this.refs.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            else {
                if (this.props.onSubmit(values) !== false) {
                    this.hideModal();
                }
            }
        });
    }

    render() {
        const { children, trigger } = this.props
        return (
            <span>
                <span onClick={this.showModal}>
                    {trigger}
                </span>
                <Modal title={this.props.title || this.props.name || ''}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModal}
                >
                    <SharedForm
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
    trigger: PropTypes.element.isRequired,
    children: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
}
export default SharedFormModal