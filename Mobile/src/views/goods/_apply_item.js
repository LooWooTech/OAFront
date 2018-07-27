import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Text, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import moment from 'moment'
import ListRow from '../shared/ListRow'

@inject('stores')
@observer
class GoodsApplyItem extends Component {

    handleClick = () => {
        const model = this.props.model;
        this.props.onClick(model)
    }

    render() {
        const model = this.props.model
        const iconName = model.Result === false ? "close" : "check";
        const iconColor = model.Result === false ? "red" : model.Result ? "green" : "gray"
        const applyUser = this.props.stores.userStore.isCurrentUser(model.ApplyUserId) ? "" : `申请人：${model.ApplyUserName}`
        const approvalUser = this.props.stores.userStore.isCurrentUser(model.ApprovalUserId) ? "" : `审核人：${model.ApprovalUserName}`
        const applyTime = `    申请日期：${moment(model.CreateTime).format('YYYY-MM-DD')}`
        const approvalTime = model.Result === null ? '' : `    审核日期：${moment(model.UpdateTime).format('YYYY-MM-DD')}`
        return (
            <ListRow
                title={model.Name + " x " + model.Number}
                left={<Icon name={iconName} style={{ color: iconColor }} />}
                subTitle={`${applyUser}${approvalUser}${applyTime}${approvalTime}`}
                onClick={this.handleClick}
            />
        );
    }
}

GoodsApplyItem.propTypes = {
    model: PropTypes.object.isRequired
}

export default GoodsApplyItem;