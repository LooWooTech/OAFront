import React from 'react';
import Header from './_header'
import Sider from './_sider'
import DocumentTitle from 'react-document-title'
import nav from '../shared/_nav'

export default class Layout extends React.Component {

  state = {
    sideMenuData: nav.getSideMenu(this.props.pathname)
  }

  getPageTitle = (menu) => {
    let title = '舟山市国土局定海分局办公自动化系统'
    if (menu) {
      title = menu.text + ' - ' + title;
      let url = this.props.location.pathname + this.props.location.search
      menu.children.map(g => g.items.map(item => {
        if (url.indexOf(item.path || item.name) === 0) {
          title = item.text + ' - ' + title
        }
        return null
      }));
    }
    return title;
  }

  render() {

    const sideMenu = nav.getSideMenu(this.props.location.pathname)

    return <DocumentTitle title={this.getPageTitle(sideMenu)}>
      <div id="app">
        <Header />
        <div id="page-container">
          <Sider pathname={this.props.location.pathname} search={this.props.location.search} sideMenuData={sideMenu} />
          <div id="main-content">
            {this.props.children}
          </div>
        </div>
      </div>
    </DocumentTitle>
  }
}