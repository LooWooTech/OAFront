import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Dimensions } from 'react-native'
import FlowDataListItem from './_item'
import ListEmptyComponent from '../shared/ListEmptyComponent'

class FlowDataList extends Component {

    keyExtractor = (item, index) => item.ID;
    renderItem = ({ item }) => <FlowDataListItem data={item} />

    render() {
        const list = this.props.data.sort((a, b) => a.ID - b.ID)
        return (
            <FlatList
                data={list}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                style={{ height: Dimensions.get('window').height - 185, backgroundColor: '#fff' }}
                ListEmptyComponent={<ListEmptyComponent icon="retweet" text="没有流程信息" />}
            />
        );
    }
}

FlowDataList.propTypes = {
    data: PropTypes.object.isRequired
}
export default FlowDataList;