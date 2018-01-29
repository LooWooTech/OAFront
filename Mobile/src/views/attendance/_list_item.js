import React, { Component } from 'react';
import { Icon } from 'native-base'
import moment from 'moment'
import ListRow from '../shared/ListRow'

const LeaveItem = ({ model, onClick }) => {
    const types = ['公事', '私事', '病假', '调休']
    const title = `${types[model.InfoId - 1]}请假：${model.Reason}`

    const subTitle = `请假时段：${moment(model.ScheduleBeginTime).format('YYYY-MM-DD HH:mm')} 到 ${moment(model.ScheduleEndTime).format('YYYY-MM-DD HH:mm')}\n申请人：${model.ApplyUser}  \t审核人：${model.ApprovalUser}`

    const iconName = model.Result == null ? 'clock-o' : model.Result ? 'check' : 'close'
    const iconColor = model.Result == null ? '#888' : model.Result ? 'green' : 'red'
    return (
        <ListRow
            title={title}
            left={<Icon name={iconName} style={{ color: iconColor }} />}
            subTitle={subTitle}
            onClick={onClick}
        />
    );
}
export default LeaveItem;