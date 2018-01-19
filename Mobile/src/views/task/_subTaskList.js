import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Body, Left, Right, Title, Icon, Content, Footer, List, ListItem, Text, View, Button } from 'native-base'
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import SubTaskItem from './_subTaskItem'

@inject('stores')
@observer
class SubTaskList extends Component {

    componentWillMount() {
        this.props.stores.taskStore.getSubTaskList()
    }

    keyExtractor = (item, index) => item.ID;
    renderItem = ({ item }) => {
        return <SubTaskItem data={item} />
    }
    
    render() {
        const data = this.props.stores.formInfoStore.data;
        const masterTasks = this.props.stores.taskStore.masterTasks;
        return (
            <Content>
                <FlatList
                    data={masterTasks}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    style={{ height: Dimensions.get('window').height - 185, backgroundColor: '#fff' }}
                    ListEmptyComponent={<ListEmptyComponent icon="list" text="没有子任务" />}
                />
            </Content>
        );
    }
}

export default SubTaskList;