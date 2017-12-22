import React, { Component } from 'react';
import { Header, Left, Right, Body, Title, Icon } from 'native-base'
import PropTypes from 'prop-types';

class Navbar extends Component {
    render() {
        const { left, title, right } = this.props
        return (
            <Header>
                {left ? <Left>{left}</Left> : null}
                <Body>
                    <Title>
                        {title}
                    </Title>
                </Body>
                {right ? <Right>{right}</Right> : null}
            </Header>
        );
    }
}

Navbar.propTypes = {
    left: PropTypes.element,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    right: PropTypes.element
};

export default Navbar;