import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Text, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import moment from 'moment'
import ListRow from '../shared/ListRow'
import { FORMS } from '../../common/config';

import LeaveItem from '../attendance/_list_item'

@inject('stores')
@observer
class FormExtend1ListItem extends Component {
    handleClick = () => {
        const model = this.props.model
        this.props.onClick(model)
    }
    render() {
        const model = this.props.model
        switch (model.FormId) {
            case FORMS.Attendance.ID:
                return <LeaveItem model={model} onClick={this.handleClick} />;
        }

        const subTitle = `${model.Reason}\n申请时段：${moment(model.ScheduleBeginTime).format('MM-DD HH:mm')} ~ ${moment(model.ScheduleEndTime).format('MM-DD HH:mm')}\n申请人：${model.ApplyUser} 审核人：${model.ApprovalUser}`

        const iconName = model.Result == null ? 'clock-o' : model.Result ? 'check' : 'close'
        const iconColor = model.Result == null ? '#888' : model.Result ? 'green' : 'red'
        return (
            <ListRow
                title={model.Title}
                left={<Icon name={iconName} style={{ color: iconColor }} />}
                subTitle={subTitle}
                onClick={this.handleClick}
            />
        );
    }
}

FormExtend1ListItem.propTypes = {
    model: PropTypes.object.isRequired
}

export default FormExtend1ListItem;