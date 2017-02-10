import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'
import auth from '../../models/auth'


class Header extends Component {
    render() {
        return (
            <div id="navigation">
                <IndexLink to='/'>Home</IndexLink> |
                <Link to='/login'>Login</Link> |
                <Link to='/logout'>Logout</Link>
            </div>
        );
    }
}

export default Header