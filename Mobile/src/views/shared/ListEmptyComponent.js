import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Icon, Text } from 'native-base';

class ListEmptyComponent extends Component {
    render() {
        const { style, icon, text, loading } = this.props
        return (
            <View style={style}>
                <Icon name={loading ? 'spinner' : icon} style={{ fontSize: 48, color: '#999' }} />
                <Text style={{ lineHeight: 30, color: '#999' }}>{loading ? '加载中...' : text}</Text>
            </View>
        );
    }
}

ListEmptyComponent.propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
    loading: PropTypes.bool
};
ListEmptyComponent.defaultProps = {
    style: { alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 50 }
}

export default ListEmptyComponent;