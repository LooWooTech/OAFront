import React from 'react';
import Header from './_header'
import Sider from './_sider'

export default class Layout extends React.Component {

  render() {
    return (
      <div id="app">
        <Header />
        <div id="page-container">
          <Sider pathname={this.props.location.pathname} />
          <div id="main-content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}