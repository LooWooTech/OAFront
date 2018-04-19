import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Content, Form, Item, Input, Label, Picker, Switch, Text, View, ListItem, List, Left, Body, Right, Textarea, Row, Col, Icon } from 'native-base'
import { Dimensions, TextInput, StyleSheet, Platform } from 'react-native';
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
        const { item } = this.props
        const disabled = item.disabled || this.props.disabled
        let multiline = false
        const left = item.title ? <Label>{item.title}</Label> : (item.left || null)
        switch (item.type) {
            case 'date':
            case 'datetime':
                const val = item.value || item.defaultValue || ''
                return (
                    <Row>
                        <Col style={styles.left}>
                            {left}
                        </Col>
                        <Col style={styles.body}>
                            <DatePicker
                                mode={item.type}
                                date={val}
                                onDateChange={this.handleChangeValue}
                                showIcon={false}
                                is24Hour={true}
                                customStyles={{
                                    dateIcon: { fontSize: 8, paddingRight: 10, width: 80, },
                                    dateInput: { backgroundColor: 'transparent', borderWidth: 0, alignSelf: 'auto', flexDirection: 'row', justifyContent: 'space-between', height: 44 },
                                }}
                                placeholder={item.placeholder || '请选择日期'}
                                style={{ flex: 0, width: '99%' }}
                                disabled={disabled}
                            />
                        </Col>
                    </Row>
                )
            case 'textarea':
                return (
                    <ListRow
                        left={left}
                        body={<Input multiline={true}
                            placeholder={item.placeholder}
                            defaultValue={item.defaultValue}
                            onChangeText={this.handleChangeValue}
                            style={{ borderBottomWidth: 0.5, borderBottomColor: '#ccc' }}
                            disabled={disabled}
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
                        body={<Input placeholder={item.placeholder}
                            multiline={multiline}
                            defaultValue={item.defaultValue}
                            onChangeText={this.handleChangeValue}
                            disabled={disabled}
                        />}
                        right={item.right}
                    />
                );
            case 'file':
                return <Item><Label>暂不支持文件上传</Label></Item>
            case 'select':
                if (!item.options || !item.options.length) {
                    return null
                }
                return (
                    <Row>
                        <Col style={styles.left}>
                            {left}
                        </Col>
                        <Col style={styles.body}>
                            {Platform.OS === 'ios' ?
                                <Picker
                                    placeholder={item.placeholder || item.title}
                                    selectedValue={item.value || item.defaultValue || 0}
                                    enabled={!disabled}
                                    onValueChange={this.handleChangeValue}
                                >
                                    {item.options.map(opt => <Item key={opt.value} label={opt.label || opt.text} value={opt.value} />)}
                                </Picker>
                                :
                                <Picker
                                    placeholder={item.placeholder || item.title}
                                    selectedValue={item.value || item.defaultValue || 0}
                                    enabled={!disabled}
                                    onValueChange={this.handleChangeValue}
                                >
                                    <Item label={item.placeholder || item.title || '请选择'} value='' />
                                    {item.options.map(opt => <Item key={opt.value} label={opt.label || opt.text} value={opt.value} />)}
                                </Picker>
                            }
                        </Col>
                    </Row>
                )
                break;
            case 'hidden':
                return (
                    <View style={{ height: 0, opacity: 0 }} >
                        <TextInput editable={false} defaultValue={(item.defaultValue || '').toString()} disabled={disabled} />
                    </View>
                )
            case 'switch':
            case 'toggle':
                return (
                    <ListRow
                        left={left}
                        title={item.text || ' '}
                        right={<Switch
                            value={item.value === undefined ? item.defaultValue : item.value}
                            onValueChange={this.handleChangeValue}
                            disabled={disabled}
                        />}
                    />
                )
        }
    }
}

const styles = StyleSheet.create({
    left: {
        flex: 0,
        height: 44,
        width: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    body: { borderBottomWidth: 0.5, borderBottomColor: '#c9c9c9' },
    right: {
        flex: 0,
        height: 44,
        maxWidth: 100,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default class SharedForm extends Component {
    componentWillMount() {
        let data = {};
        this.props.items.map(item => {
            if (item.name) {
                data[item.name] = item.value || item.defaultValue
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