import React from 'react'
import { Menu } from 'antd'
import auth from '../../models/auth'
import utils from '../../utils'

class Sider extends React.Component {

    handleMenuClick = (e, user) => {
        var item = e.item.props.item;
        if (this.props.pathname === item.path) {
            return false;
        }
        let path = item.path;
        path = item.path.replace('{UserId}', user.ID);
        utils.Redirect(path);
    };

    render() {
        const user = auth.getUser();
        const pathname = this.props.pathname;
        const search = this.props.search;
        const url = pathname + search;
        
        const menu = this.props.sideMenuData;
        
        if (!menu || !menu.children || menu.children.length === 0) return null;
        return <div id='sider'>
            <Menu
                onClick={e => this.handleMenuClick(e, user)}
                selectedKeys={[pathname, url]}
                style={{ borderRight: 'none' }}
            >
                {menu.children.map((group, key) => {
                    var show = user.Role >= (group.role || 0);
                    return show ? <Menu.ItemGroup title={group.title || ''} key={key}>
                        {group.items.map((item, key) => {
                            var show = auth.hasRight(item.right) && user.Role >= (item.role || 0);

                            return show ? <Menu.Item key={item.path} item={item}>
                                <i className={item.icon} />&nbsp;{item.text}
                            </Menu.Item> : null
                        })}
                    </Menu.ItemGroup> : null
                })}
            </Menu>
        </div>
    }
}

export default Sider