import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Item, Input, Label, Picker, Switch, Text, View, ListItem, List, Left, Body, Right } from 'native-base'

const SharedFormItem = ({ item, disabled }) => {
    let multiline = false
    switch (item.type) {
        case 'data':
            <ListItem icon>
                <Left>
                    <Text>{item.title}</Text>
                </Left>
                <Body>
                    <Input value={(item.defaultValue || '').toString()} disabled={disabled} />
                </Body>
            </ListItem>
        default:
            multiline = item.defaultValue != null && item.defaultValue.length > 16
            return (
                <ListItem icon={!multiline} avatar={multiline}>
                    <Left>
                        <Text>{item.title}</Text>
                    </Left>
                    <Body>
                        <Input multiline={multiline} value={(item.defaultValue || '').toString()} disabled={disabled} />
                    </Body>
                </ListItem>
            );
        case 'file':
            multiline = item.defaultValue != null && item.defaultValue.FileName.length > 16
            return (
                <ListItem icon={!multiline} avatar={multiline}>
                    <Left>
                        <Text>{item.title}</Text>
                    </Left>
                    <Body>
                        <Input multiline={multiline} value={(item.defaultValue || {}).FileName.toString()} disabled={disabled} />
                    </Body>
                </ListItem>
            );
        case 'select':
            return (
                <ListItem icon>
                    <Left>
                        <Text>{item.title}</Text>
                    </Left>
                    <Body>
                        <Picker disabled={disabled}
                            mode='dialog'
                            placeholder={item.title}
                            selectedValue={item.defaultValue}
                            disabled={disabled}
                        >
                            {item.options.map(opt => <Item key={opt.value} label={opt.text} value={opt.value} />)}
                        </Picker>
                    </Body>
                </ListItem>
            )
            break;
        case 'hidden':
            return <View style={{ height: 0, opacity: 0 }}></View>
        //return <Input value={item.defaultValue} style={{ height: 0, opacity: 0 }} />
        case 'switch':
        case 'toggle':
            return (
                <ListItem icon>
                    <Left>
                        <Text>{item.title}</Text>
                    </Left>
                    <Body></Body>
                    <Right>
                        <Switch value={item.defaultValue} />
                    </Right>
                </ListItem>
            )
    }
}

class SharedForm extends Component {
    render() {
        return (
            <List>
                {this.props.items.map((item, key) => <SharedFormItem key={item.name + key} item={item} disabled={this.props.disabled} />)}
            </List>
        );
    }
}

SharedForm.propTypes = {
    items: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
};

export default SharedForm;