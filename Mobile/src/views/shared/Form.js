import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Content, Form, Item, Input, Label, Picker, Switch, Text, View, ListItem, List, Left, Body, Right, Textarea } from 'native-base'
import { Dimensions, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker'

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
        const label = item.title ? <Label>{item.title}</Label> : null
        switch (item.type) {
            case 'date':
                return (
                    <Item inlineLabel>
                        {label}
                        <DatePicker onDateChange={this.handleChangeValue} />
                    </Item>
                )
            case 'textarea':
                return (
                    <Item inlineLabel>
                        {label}
                        <Input multiline={true} placeholder={item.placeholder}
                            defaultValue={item.defaultValue}
                            onChangeText={this.handleChangeValue}
                        />
                    </Item>
                );
            default:
                if (item.render) {
                    return (
                        label ?
                            <Item inlineLabel>
                                {label}
                                {item.render}
                            </Item>
                            : item.render
                    )
                }
                multiline = item.defaultValue != null && item.defaultValue.length > 16
                return (
                    <Item inlineLabel>
                        {label}
                        <Input placeholder={item.placeholder} multiline={multiline} defaultValue={item.defaultValue} onChangeText={this.handleChangeValue} />
                    </Item>
                );
            case 'file':
                return <Item><Label>暂不支持文件上传</Label></Item>
            case 'select':
                return (
                    <Item inlineLabel>
                        {label}
                        <Picker disabled={disabled}
                            mode='dialog'
                            placeholder={item.title}
                            selectedValue={item.defaultValue}
                            disabled={disabled}
                            onValueChange={this.handleChangeValue}
                        >
                            {item.options.map(opt => <Item key={opt.value} label={opt.text} value={opt.value} />)}
                        </Picker>
                    </Item>
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
                    <ListItem icon>
                        <Left>
                            <Text>{item.title}</Text>
                        </Left>
                        <Body></Body>
                        <Right>
                            <Switch value={item.defaultValue} onValueChange={this.handleChangeValue} />
                        </Right>
                    </ListItem>
                )
        }
    }
}

export default class SharedForm extends Component {
    render() {
        return (
            <Form style={{backgroundColor:'#fff'}}>
                {this.props.items.map((item, key) => <SharedFormItem key={'form-item' + key} item={item} disabled={this.props.disabled} />)}
            </Form>
        );
    }
}

SharedForm.propTypes = {
    items: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
};