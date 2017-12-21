import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Image, Text, View, TouchableOpacity } from 'react-native'
import { Menu, Badge, Icon, SegmentedControl, Button } from 'antd-mobile'
import MissiveItem from './_item'
import missiveStore from '../../stores/missiveStore'
import formStore from '../../stores/formStore'

const menuData = [
    { label: '待办件', value: 1 },
    { label: '已办件', value: 2 },
    { label: '完结件', value: 3 },
    { label: '退回件', value: 4 },
]

@inject('stores')
@observer
class MissiveList extends Component {
    static navigationOptions = ({ navigation }) => {
        const form = formStore.getForm(navigation.state.params.formId)
        const status = navigation.state.params.status || 1
        return ({
            title: form.Name ,
            headerRight: (
                <TouchableOpacity style={{ margin: 10, justifyContent: 'center', width: 40 }} >
                    <Icon type={'\uf0c9'} />
                </TouchableOpacity>
            )
        })
    };
    render() {
        return (
            <View>

            </View>
        );
    }
}

export default MissiveList;