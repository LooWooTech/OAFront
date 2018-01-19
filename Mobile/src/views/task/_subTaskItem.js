import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Icon, Left, Body, Right, SwipeRow, Button, ListItem } from 'native-base'
import ListRow from '../shared/ListRow'
import { inject, observer } from 'mobx-react';
import moment from 'moment'

class SubTaskItem extends Component {
    render() {
        const item = this.props.data
        return (
            <View>
                <SubTaskItemRender data={item} navigation={this.context.navigation} />
                {item.children.map(child => <SubTaskItemRender key={child.ID} data={child} navigation={this.context.navigation} />)}
            </View>
        );
    }
}
SubTaskItem.contextTypes = {
    navigation: PropTypes.object.isRequired
}
export default SubTaskItem;

@inject('stores')
@observer
class SubTaskItemRender extends Component {

    handleClick = () => {
        const subTask = this.props.data
        this.props.navigation.navigate('SubTask.Detail', { data: subTask })
    }

    render() {
        const { data, style } = this.props

        let iconName = "clock-o";
        let iconColor = data.IsMaster ? "#ff4728" : "#108ee9";
        switch (data.Status) {
            default:
            case 1:
                iconName = "clock-o";
                break;
            case 2:
                iconName = "check";
                break;
            case 3:
                iconName = "close";
                break;
        }
        return (
            <View>
                <ListRow
                    left={<Icon name={iconName} style={{ color: iconColor }} />}
                    title={data.Content}
                    subTitle={`${data.IsMaster ? '主办' : '协办'}：${data.ToDepartmentName}\t     责任人：${data.ToUserName || '未指派'}\n计划完成时间：${data.ScheduleDate ? moment(data.ScheduleDate).format('YYYY-MM-DD') : ''}`}
                    right={<Icon name="angle-right" />}
                    style={style}
                    onClick={this.handleClick}
                />
            </View>
        )
    }
}
SubTaskItemRender.contextTypes = {
    navigation: PropTypes.object.isRequired
}
SubTaskItemRender.propTypes = {
    data: PropTypes.object.isRequired,
    style: PropTypes.object
}