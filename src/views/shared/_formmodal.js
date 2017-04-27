import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SharedModal from './_modal'
import SharedForm from './_form'

class SharedFormModal extends Component {
    handleSubmit = () => {
        const values = this.refs.form.getFieldsValue();
        return this.props.onSubmit(values);
    }

    render() {
        const { name, title, children, trigger } = this.props
        return (
            <SharedModal title={name || title || ''}
                trigger={trigger}
                onSubmit={this.handleSubmit}
                children={<SharedForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    children={children}
                />}
            />
        )
    }
}
SharedFormModal.propTypes = {
    trigger: PropTypes.element.isRequired,
    children: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
}
export default SharedFormModal