import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Left, Button, Icon } from 'native-base'
class BackButton extends Component {
    
    handleClick = () => {
        const { routeName, params } = this.props
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
    routeName: PropTypes.string,
    params: PropTypes.object
};

export default BackButton;