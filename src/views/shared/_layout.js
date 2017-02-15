import React from 'react';
import Header from './_header'
import Sider from './_sider'

export default class Layout extends React.Component {

  render() {
    return (
      <div className="App">
        <Header/>
        <div id="container">
          <Sider pathname={this.props.location.pathname} />
          <div id="main">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}