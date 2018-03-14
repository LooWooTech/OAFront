import React, { Component } from 'react';
import { Dimensions } from 'react-native'
import PropTypes from 'prop-types';
import { List, ListItem, Icon, Left, Body, Right, Text, View } from 'native-base'
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu'

class NavbarOption extends Component {

}

class NavbarPopover extends Component {

    menu = null

    show = () => {
        this.menu.open();
    }

    hide = ()=>{
        this.menu.close();
    }

    handleSelect = (val) => {
        this.hide();
        if (this.props.onSelect) {
            this.props.onSelect(val)
        }
    }

    render() {
        return (
            <Menu ref={r => this.menu = r} renderer={renderers.Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                <MenuTrigger />
                <MenuOptions style={{ width: 240 }}>
                    {this.props.data.map((item, key) => (
                        <MenuOption key={key}>
                            <ListItem icon onPress={() => this.handleSelect(item)}>
                                <Left>
                                    <Icon name={item.icon} style={{ fontSize: 18 }} />
                                </Left>
                                <Body>
                                    <Text>
                                        {item.label}
                                    </Text>
                                </Body>
                            </ListItem>
                        </MenuOption>
                    ))}
                </MenuOptions>
            </Menu>
        );
    }
}
NavbarPopover.PropTypes = {
    data: PropTypes.array.isRequired,
    onSelect: PropTypes.func
}

export default NavbarPopover;