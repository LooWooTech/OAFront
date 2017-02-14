import React from 'react'
import { Link } from 'react-router'

class Sider extends React.Component {

    state = {
        menus: {
            home: [
                [
                    { name: 'all-feed', active: true, path: '?scope=all', icon: 'fa fa-comment', text: '全部动态' },
                    { name: 'my-feed', path: '?scope=my', icon: 'fa fa-comment-o', text: '我的动态' },
                    { name: 'star-feed', path: '?scope=star', icon: 'fa fa-star-o', text: '星标动态' }
                ],
                [

                ]
            ],
            document: [
                [
                    { name: 'document-sends', active: true, path: '/document/sends', icon: 'fa fa-send', text: '发文查询' },
                    { name: 'document-edit', path: '/document/edit', icon: 'fa fa-pencil-square-o', text: '发文拟稿' },
                    { name: 'document-receives', path: '/document/receives', icon: 'fa fa-envelope-open-o', text: '收文查询' }
                ],
                [

                ]
            ]
        }
    };

    getMenu(path) {
        var name = path.substring(1);
        var index = name.indexOf('/');
        if (index === -1) {
            index = name.length;
        }
        name = name.substring(0, index) || 'home';

        return this.state.menus[name] || [];
    }
    getMenuTag(menu, key) {
        return (
            <Link key={key} onlyActiveOnIndex={menu.active} to={menu.path || menu.name} className='item' activeClassName='active'><i className={menu.icon} />&nbsp;{menu.text}</Link>
        )
    }

    render() {
        return (
            <div id='sider' className='ui pointing secondary vertical menu'>
                {this.getMenu(this.props.location.pathname)
                    .map((groups, key) =>
                        <div className='menu-groups' key={key}>
                            {groups.map((menu, subKey) => this.getMenuTag(menu, subKey))}
                            {groups.length > 0 ? <hr /> : ''}
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Sider