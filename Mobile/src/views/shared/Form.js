import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Content, Form, Item, Input, Label, Picker, Switch, Text, View, ListItem, List, Left, Body, Right, Textarea } from 'native-base'
import { Dimensions, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker'
import ListRow from './ListRow'

class SharedFormItem extends Component {
    state = {}
    getValue = () => {
        const item = this.props.item
        return this.state.value === undefined ? item.defaultValue : this.state.value
    }
    handleChangeValue = val => {
        this.setState({ value: val })
    }

    render() {
        const { item, disabled } = this.props
        if (!item.name && !item.render) {
            return null
        }
        let multiline = false
        const left = item.title ? <Label>{item.title}</Label> : (item.left || null)
        switch (item.type) {
            case 'date':
                return (
                    <ListRow
                        left={left}
                        body={<DatePicker onDateChange={this.handleChangeValue} />}
                        right={item.right}
                    />
                )
            case 'textarea':
                return (
                    <ListRow
                        left={left}
                        body={<Input multiline={true} placeholder={item.placeholder}
                            defaultValue={item.defaultValue}
                            onChangeText={this.handleChangeValue}
                            style={{ borderBottomWidth: 0.5, borderBottomColor: '#ccc' }}
                        />}
                        right={item.right}
                    />
                );
            default:
                if (item.render) {
                    return (
                        <ListRow
                            left={left}
                            body={item.render}
                            right={item.right}
                        />
                    )
                }
                multiline = item.defaultValue != null && item.defaultValue.length > 16
                return (
                    <ListRow
                        left={left}
                        body={<Input placeholder={item.placeholder} multiline={multiline} defaultValue={item.defaultValue} onChangeText={this.handleChangeValue} />}
                        right={item.right}
                    />
                );
            case 'file':
                return <Item><Label>暂不支持文件上传</Label></Item>
            case 'select':
                return (
                    <ListRow
                        left={left}
                        right={item.right}
                    >
                        <Picker disabled={disabled}
                            mode='dialog'
                            placeholder={item.title}
                            selectedValue={item.defaultValue}
                            disabled={disabled}
                            onValueChange={this.handleChangeValue}
                        >
                            {item.options.map(opt => <Item key={opt.value} label={opt.text} value={opt.value} />)}
                        </Picker>
                    </ListRow>
                )
                break;
            case 'hidden':
                return (
                    <View style={{ height: 0, opacity: 0 }} >
                        <TextInput editable={false} defaultValue={(item.defaultValue || '').toString()} />
                    </View>
                )
            case 'switch':
            case 'toggle':
                return (
                    <ListRow
                        left={left}
                        body={<Text> </Text>}
                        right={<Switch value={item.defaultValue} onValueChange={this.handleChangeValue} />}
                    />
                )
        }
    }
}

export default class SharedForm extends Component {
    render() {
        return (
            <List style={{ backgroundColor: '#fff' }}>
                {this.props.items.map((item, key) => <SharedFormItem key={'form-item' + key} item={item} disabled={this.props.disabled} />)}
            </List>
        );
    }
}

SharedForm.propTypes = {
    items: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
};