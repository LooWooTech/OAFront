import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View,Text } from 'react-native';

class HomeIndexView extends Component {
    render() {
        console.log("welcome")
        return (
            <View>
                <Text>欢迎</Text>
            </View>
        );
    }
}

HomeIndexView.propTypes = {

};

export default HomeIndexView;