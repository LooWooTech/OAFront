import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Content, Form, Item, Input, Label, Picker, Switch, Text, View, ListItem, List, Left, Body, Right, Textarea } from 'native-base'
import { Dimensions, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker'
import ListRow from './ListRow'

class SharedFormItem extends Component {
    state = {}

    handleChangeValue = (val) => {
        const item = this.props.item
        item.value = val;
        this.props.onChange(item)
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
                        title={item.text || ' '}
                        right={<Switch value={item.value === undefined ? item.defaultValue : item.value} onValueChange={this.handleChangeValue} />}
                    />
                )
        }
    }
}

export default class SharedForm extends Component {
    componentWillMount() {
        let data = {};
        this.props.items.map(item => {
            if (item.name) {
                data[item.name] = item.defaultValue
            }
        })
        this.setState({ data })
    }

    handleItemChangedValue = (item) => {
        if (item.name) {
            let data = this.state.data
            data[item.name] = item.value
            this.setState({ data })
        }
    }

    getData = () => {
        return this.state.data
    }

    render() {
        return (
            <List style={{ backgroundColor: '#fff' }}>
                {this.props.items.map((item, key) => (
                    <SharedFormItem
                        key={'form-item' + key}
                        item={item}
                        onChange={this.handleItemChangedValue}
                        disabled={this.props.disabled}
                    />
                ))}
            </List>
        );
    }
}

SharedForm.propTypes = {
    items: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
};