import React, { Component } from 'react'
import ApplyList from './apply_list'
import auth from '../../models/auth'
class MyApplyList extends Component {
    render() {
        let user = auth.getUser()
        let formId = this.props.params.formId || 0;
        return (
            <ApplyList userId={user.ID} formId={formId} />
        )
    }
}

export default MyApplyList