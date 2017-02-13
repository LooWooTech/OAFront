import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import auth from '../../models/auth'
import FontAwesome from 'react-fontawesome'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'

export default class Header extends Component {

    state = { activeItem: 'home' }
    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        if (name === 'home') {
            hashHistory.push('/')
        } else {
            hashHistory.push("/" + name)
        }
    }

    render() {
        let items = [
            { name: 'home', icon: 'commenting', text: '动态' },
            { name: 'document', icon: 'file-o', text: '公文' },
            { name: 'calendar', icon: 'calendar', text: '日程' },
            { name: 'task', icon: 'clock-o', text: '任务' },
            { name: 'news', icon: 'newspaper-o', text: '信息' },
            { name: 'attendace', icon: 'calendar-check-o', text: '考勤' },
            { name: 'archive', icon: 'tasks', text: '档案' },
            { name: 'meeting', icon: 'television', text: '会议' },
            { name: 'car', icon: 'car', text: '车辆' },
            { name: 'file', icon: 'files-o', text: '文档' },
        ].map((item, key) => {
            return (
                <Menu.Item name={item.name} active={this.state.activeItem === item.name} onClick={this.handleItemClick}>
                    <FontAwesome name={item.icon} />&nbsp;{item.text}
                </Menu.Item>
            )
        });

        let username = (<span><Icon name='user' />Hello, Bob</span>)

        return (
            !auth.hasLogin() ?
                <Menu id='header'>
                    {items}
                    <Menu.Menu position='right'>
                        <Dropdown trigger={username} pointing className='link item'>
                            <Dropdown.Menu>
                                <Dropdown.Item>个人资料</Dropdown.Item>
                                <Dropdown.Item>修改密码</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item>通讯录</Dropdown.Item>
                                <Dropdown.Item>消息设置</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item>退出登录</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                </Menu>
                :
                null
        );
    }
}