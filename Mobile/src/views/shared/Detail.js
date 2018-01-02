import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Content, Item, Input, Label, Picker, Switch, Text, View, ListItem, List, Left, Body, Right, Textarea } from 'native-base'
import { Dimensions, FlatList } from 'react-native';
import ListRow from '../shared/ListRow'

const SharedDetailItem = ({ item }) => {
    let multiline = false
    switch (item.type) {
        case 'date':
        default:
            multiline = item.defaultValue != null && item.defaultValue.length > 16
            return (
                <ListRow
                    left={<Text>{item.title}</Text>}
                    title={(item.defaultValue || ' ').toString()}
                    right={null}
                />
            );
        case 'file':
            multiline = item.defaultValue != null && item.defaultValue.FileName.length > 16
            return (
                <ListRow
                    left={<Text>{item.title}</Text>}
                    title={(item.defaultValue || {}).FileName.toString()}
                    right={null}
                />
            );
        case 'select':
            return (
                <ListRow
                    left={<Text>{item.title}</Text>}
                    title={(item.options.find(opt => opt.value === item.defaultValue) || {}).text || item.defaultValue}
                    right={null}
                />
            )
            break;
        case 'hidden':
            return <View style={{ height: 0, opacity: 0 }}></View>
        //return <Input value={item.defaultValue} style={{ height: 0, opacity: 0 }} />
        case 'switch':
        case 'toggle':
            return (
                <ListRow
                    left={<Text>{item.title}</Text>}
                    title={' '}
                    right={<Switch value={item.defaultValue} disabled={true} />}
                />
            )
    }
}

class SharedDetail extends Component {
    render() {
        return (
            <List>
                {this.props.items.map((item, key) => <SharedDetailItem key={item.name + key} item={item} />)}
            </List>
        );

        // const items = this.props.items || []
        // const data = items.map((item, index) => { item.key = item.name + index; return item; })

        // return <FlatList
        //     keyExtractor={(item, key) => key}
        //     data={data}
        //     renderItem={(item) => <SharedDetailItem key={item.key} item={item} />}
        // />
    }
}

SharedDetail.propTypes = {
    items: PropTypes.array.isRequired,
};

export default SharedDetail;