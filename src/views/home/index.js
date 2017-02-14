import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
export default class Home extends Component {
    render() {
        return (
            <div>
                <h1>Homepage</h1>
                <Button primary>Hello</Button>
            </div>
        );
    }
}