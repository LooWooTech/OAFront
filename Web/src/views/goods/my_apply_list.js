import React, { Component } from 'react'
import GoodsApplyList from './apply_list'
import auth from '../../models/auth'
export default class MyApplyList extends Component {
    render() {
        const userId = auth.getUser().ID || 0;
        return (
            <GoodsApplyList applyUserId={userId} location={this.props.location}/>
        )
    }
}
