import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Icon, Left, Body, Right, SwipeRow, Button, ListItem } from 'native-base'
import ListRow from '../shared/ListRow'
import { inject, observer } from 'mobx-react';
import { Alert } from 'react-native'
import moment from 'moment'

class TodoList extends Component {
    render() {
        const list = this.props.data
        return (
            list.map(todo => <TodoItem key={todo.ID} data={todo} />)
        );
    }
}

TodoList.propTypes = {
    data: PropTypes.object.isRequired
};

export default TodoList;

@inject('stores')
@observer
class TodoItem extends Component {
    handleLongPress = () => {
        const todo = this.props.data
        if (this.props.stores.userStore.isCurrentUser(todo.CreatorId)) {
            //删除
        }
    }

    handleClick = () => {
        const todo = this.props.data
        if (
            !this.props.stores.userStore.isCurrentUser(todo.ToUserId)
            //&& !this.props.stores.userStore.isCurrentUser(todo.CreatorId)
        ) {
            return false;
        }
        const msg = '标记为' + (todo.Completed ? '未完成' : '完成') + '吗？';
        Alert.alert('提醒', msg, [
            { text: '取消', onPress: () => { }, style: 'cancel' },
            {
                text: '确定', onPress: () => {
                    todo.Completed = !todo.Completed
                    this.props.stores.taskStore.updateTodoStatus(todo.ID)
                }
            }], {
                cancelable: true
            })
    }

    render() {
        const todo = this.props.data
        const isMyTodo = this.props.stores.userStore.isCurrentUser(todo.ToUserId)
        const icon = todo.Completed ? (isMyTodo ? "check-square" : "check") : (isMyTodo ? "square-o" : "clock-o")
        return (
            <ListRow
                left={<Icon name={icon} style={{ color: '#108ee9' }} />}
                title={todo.Content}
                subTitle={`负责人：${todo.ToUserName} 计划完成时间：${todo.ScheduleDate ? moment(todo.ScheduleDate).format('YYYY-MM-DD') : ''}`}
                onClick={isMyTodo ? this.handleClick : null}
                onLongPress={isMyTodo ? this.handleLongPress : null}
            />
        );
    }
}