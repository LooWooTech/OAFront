import React from 'react';
import Header from './_header'
import Sider from './_sider'

export default class Layout extends React.Component {

  render() {
    return (
      <div className="App">
        <Header  location={this.props.location}/>
        <div id="container">
          <Sider location={this.props.location} />
          <div id="main">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}