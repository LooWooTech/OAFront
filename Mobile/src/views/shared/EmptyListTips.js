import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Icon, Text } from 'native-base';

class EmptyListTips extends Component {
    render() {
        return (
            <View style={this.props.style}>
                <Icon name={this.props.icon} style={{ fontSize: 60, color: '#999' }} />
                <Text style={{ lineHeight: 30, color: '#999' }}>{this.props.text}</Text>
            </View>
        );
    }
}

EmptyListTips.propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    style: PropTypes.object
};
EmptyListTips.defaultProps = {
    style: { alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 50 }
}

export default EmptyListTips;