import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Image, Text, View, } from 'react-native'
import { Badge, Icon, SegmentedControl, Button } from 'antd-mobile'
import MissiveItem from './_item'
import missiveStore from '../../stores/missiveStore'

@inject('stores')
@observer
class MissiveList extends Component {
    render() {
        return (
            <View>
            
            </View>
        );
    }
}

export default MissiveList;