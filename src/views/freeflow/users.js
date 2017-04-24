import React, { Component } from 'react'
import { Tabs, Icon } from 'antd'
import SharedModal from '../shared/_modal'

class SelectUserModal extends Component {
    handleSubmit = () => {

    }
    getFormItems = () => {
        var items = [];

        return items;
    }

    render() {
        return (
            <SharedModal
                title="选择人员"
                onSubmit={this.handleSubmit}
                trigger={<a><Icon type="user-add" />选择人员</a>}
                children={<div></div>}
            />
        )
    }
}

export default SelectUserModal