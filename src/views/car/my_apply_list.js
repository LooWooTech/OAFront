import React, { Component } from 'react'
import Approval from './apply_list'
import auth from '../../models/auth'
class MyApplyList extends Component {
    render() {
        let user = auth.getUser()
        return (
            <Approval userId={user.ID} />
        )
    }
}
export default MyApplyList