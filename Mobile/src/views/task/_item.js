import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Text, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import moment from 'moment'
import ListRow from '../shared/ListRow'

class TaskListItem extends Component {
    handleClick = () => {
        const model = this.props.model
        this.props.onClick(model)
    }
    render() {
        const model = this.props.model
        const iconName = model.Reminded ? "exclamation" : "clock-o";
        const iconColor = model.Reminded ? '#21b384' : '#666'
        return (
            <ListRow
                title={model.Name}
                left={<Icon name={iconName} style={{ color: iconColor }} />}
                subTitle={`计划完成：${moment(model.ScheduleDate).format('YYYY-MM-DD')} \n最后更新：${model.UpdateTime ? moment(model.UpdateTime).format('YYYY-MM-DD HH:mm') : ''}`}
                onClick={this.handleClick}
            />
        );
    }
}

TaskListItem.propTypes = {
    model: PropTypes.object.isRequired
}

export default TaskListItem;