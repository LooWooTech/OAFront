import React, { Component } from 'react';
import { Dimensions } from 'react-native'
import PropTypes from 'prop-types';
import { List, ListItem, Icon, Left, Body, Right, Text, View } from 'native-base'
import Popover from '../components/Popover'
const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height
class NavbarPopover extends Component {
    state = { isVisible: false }
    show = () => {
        this.setState({ isVisible: true })
    }
    hide = () => {
        this.setState({ isVisible: false });
    }
    handleSelect = (val) => {
        if (this.props.onSelect) {
            this.props.onSelect(val)
        }
    }

    render() {
        return (
            <Popover
                isVisible={this.state.isVisible}
                displayArea={{ x: 0, y: 60, width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}
                fromRect={{ x: WINDOW_WIDTH - 80, y: 0, width: 80, height: 50 }}
                onClose={this.hide}>
                <List style={{ width: 240 }}>
                    {this.props.data.map(item => (
                        <ListItem icon key={item.value} onPress={() => this.handleSelect(item.value)}>
                            <Left>
                                <Icon name={item.icon} style={{ fontSize: 18 }} />
                            </Left>
                            <Body>
                                <Text>
                                    {item.label}
                                </Text>
                            </Body>
                        </ListItem>
                    ))}
                </List>
            </Popover>
        );
    }
}
NavbarPopover.PropTypes = {
    data: PropTypes.array.isRequired,
    onSelect: PropTypes.func
}

export default NavbarPopover;