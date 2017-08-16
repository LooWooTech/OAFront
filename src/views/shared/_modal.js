import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'

class SharedModal extends Component {
    state = { visible: false }
    showModal = (e) => {
        if (e) e.stopPropagation()
        this.setState({ visible: true, })
    }
    hideModal = () => {
        this.setState({ visible: false, })
    }

    handleSubmit = () => {
        if (!this.props.onSubmit || this.props.onSubmit() !== false) {
            this.hideModal();
        }
    }

    render() {
        const { children, trigger } = this.props
        return (
            <span>
                <span onClick={this.showModal}>
                    {trigger}
                </span>
                <Modal title={this.props.title || ''}
                    visible={this.state.visible}
                    width={this.props.width}
                    height={this.props.height}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModal}
                >
                    {children}
                </Modal>
            </span>
        )
    }
}
SharedModal.propTypes = {
    trigger: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
}
export default SharedModal