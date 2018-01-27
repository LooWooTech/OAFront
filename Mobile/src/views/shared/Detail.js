import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Content, Item, Input, Label, Picker, Switch, Text, View, ListItem, List, Left, Body, Right, Textarea, Icon } from 'native-base'
import { Dimensions, FlatList } from 'react-native';
import moment from 'moment'
import ListRow from '../shared/ListRow'

class SharedDetailItem extends Component {
    handleClickFile = () => {
        const item = this.props.item
        const file = item.defaultValue || {}
        if (file.ID) {
            this.context.navigation.navigate('File.Preview', { file })
        }
    }
    render() {
        const item = this.props.item
        let multiline = false
        switch (item.type) {
            case 'date':
                return (
                    <ListRow
                        left={<Text>{item.title}</Text>}
                        title={item.defaultValue ? moment().format(item.format || 'YYYY-MM-DD') : ' '}
                        right={null}
                    />
                );
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
                const fileName = item.defaultValue ? item.defaultValue.FileName : null
                multiline = fileName ? fileName.length > 16 : false
                return (
                    <ListRow
                        left={<Text>{item.title}</Text>}
                        title={fileName || '还没上传文件'}
                        right={<Icon name="external-link" />}
                        onClick={fileName ? this.handleClickFile : null}
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
                        title={item.value ? "是" : "否"}
                    />
                )
        }
    }
}
SharedDetailItem.contextTypes = {
    navigation: PropTypes.object.isRequired
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