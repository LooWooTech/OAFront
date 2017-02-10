import React, { Component } from 'react';
import Header from './header'
class Layout extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div id="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Layout;
