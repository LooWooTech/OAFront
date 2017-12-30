import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Left, Button, Icon } from 'native-base'
class BackButton extends Component {

    handleClick = () => {
        const { routeName, params, onBack } = this.props
        if (onBack) {
            onBack();
        }
        if (routeName) {
            this.context.navigation.navigate(routeName, params)
        } else {
            this.context.navigation.goBack()
        }
    }
    render() {
        return (
            <Button transparent onPress={this.handleClick}>
                <Icon name='chevron-left' />
            </Button>
        );
    }
}
BackButton.contextTypes = {
    navigation: PropTypes.object.isRequired
}
BackButton.propTypes = {
    onBack: PropTypes.func,
    routeName: PropTypes.string,
    params: PropTypes.object
};

export default BackButton;