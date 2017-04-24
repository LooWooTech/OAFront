import React, { Component } from 'react'
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
        if (!this.props.onSubmit()) {
            this.hideModal()
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
    trigger: React.PropTypes.element.isRequired,
    children: React.PropTypes.element.isRequired,
    onSubmit: React.PropTypes.func.isRequired
}
export default SharedModal