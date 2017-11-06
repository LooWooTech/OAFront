import React from 'react'
import { Menu } from 'antd'
import auth from '../../models/auth'
import utils from '../../utils'
import api from '../../models/api'

const sideMenuData = {
    feed: [
        {
            title: '动态', items: [
                { path: '/?scope=all', icon: 'fa fa-comment', text: '全部动态' },
            ],
        },
        {
            title: '类型', items: Object.keys(api.Forms).map(key => {
                var form = api.Forms[key]
                return { path: '/?formId=' + form.ID, icon: 'fa fa-bookmark-o', text: form.Name }
            })
        }
    ],
    missive: [
        {
            title: '发文', items: [
                { path: `/missive/list/${api.Forms.Missive.ID}/?status=1`, icon: 'fa fa-envelope-open-o', text: '收件箱' },
                { path: `/missive/list/${api.Forms.Missive.ID}/?status=2`, icon: 'fa fa-check-square-o', text: '已办箱' },
                { path: `/missive/list/${api.Forms.Missive.ID}/?status=3`, icon: 'fa fa-archive', text: '完结箱' },
                { path: `/missive/list/${api.Forms.Missive.ID}/?status=4`, icon: 'fa fa-reply', text: '退回箱' },
            ]
        },
        {
            title: '收文', items: [
                { path: `/missive/list/${api.Forms.ReceiveMissive.ID}/?status=1`, icon: 'fa fa-envelope-open-o', text: '未读箱' },
                { path: `/missive/list/${api.Forms.ReceiveMissive.ID}/?status=2`, icon: 'fa fa-check-square-o', text: '已读箱' },
                { path: `/missive/list/${api.Forms.ReceiveMissive.ID}/?status=3`, icon: 'fa fa-archive', text: '归档箱' },
            ]
        },
        {
            title: '设置', role: 2, items: [
                { path: '/missive/redtitle', icon: 'fa fa-file', text: '文件红头' }
            ]
        }
    ],
    car: [
        {
            title: '申请', items: [
                { path: '/car', icon: 'fa fa-car', text: '车辆查询' },
                { path: `/extend1/requests/${api.Forms.Car.ID}`, icon: 'fa fa-inbox', text: '我的申请' }
            ]
        }, {
            title: '管理&审核', items: [
                { path: '/car/list', icon: 'fa fa-list', text: '车辆管理', role: 2 },
                { path: `/extend1/approvals/${api.Forms.Car.ID}`, icon: 'fa fa-check', text: '车辆审核' }
            ]
        }
    ],
    meetingroom: [
        {
            title: '申请', items: [
                { path: '/meetingroom', icon: 'fa fa-home', text: '会议室查询' },
                { path: `/extend1/requests/${api.Forms.MeetingRoom.ID}`, icon: 'fa fa-inbox', text: '我的申请' }
            ]
        }, {
            title: '管理&审核', items: [
                { path: '/meetingroom/list', icon: 'fa fa-list', text: '会议室管理', role: 2 },
                { path: `/extend1/approvals/${api.Forms.MeetingRoom.ID}`, icon: 'fa fa-check', text: '会议室审核' }
            ]
        }
    ],
    seal: [
        {
            title: '申请', items: [
                { path: '/seal', icon: 'fa fa-circle-o', text: '图章查询' },
                { path: `/extend1/requests/${api.Forms.Seal.ID}`, icon: 'fa fa-inbox', text: '我的申请' }
            ]
        }, {
            title: '管理&审核', items: [
                { path: '/seal/list', icon: 'fa fa-list', text: '图章管理', role: 2 },
                { path: `/extend1/approvals/${api.Forms.Seal.ID}`, icon: 'fa fa-check', text: '图章审核' }
            ]
        }
    ],
    task: [
        {
            title: '任务', items: [
                { path: '/task/?status=1', icon: 'fa fa-envelope-open-o', text: '待办箱' },
                { path: '/task/?status=2', icon: 'fa fa-send', text: '在办箱' },
                { path: '/task/?status=3', icon: 'fa fa-envelope', text: '已办箱' },
                { path: '/task/?scope=all', icon: 'fa fa-list', text: '所有任务' },
            ]
        }
    ],
    attendance: [
        {
            title: '考勤', items: [
                { path: '/attendance', icon: 'fa fa-calendar-check-o', text: '考勤记录' },
                { path: `/extend1/requests/${api.Forms.Leave.ID}`, icon: 'fa fa-history', text: '我的请假记录' },
            ]
        },
        {
            title: '管理', items: [
                { path: `/extend1/approvals/${api.Forms.Leave.ID}`, icon: 'fa fa-list', text: '请假审核', },
                { path: '/attendance/holidays', icon: 'fa fa-calendar', text: '节假日管理', role: 2 },
                { path: `/attendance/groups`, icon: 'fa fa-list', text: '考勤组管理', role: 2 }
            ]
        }
    ],
    salary: [
        {
            title: '工资单', items: [
                { path: '/salary/', icon: 'fa fa-file-text-o', text: '我的工资单' },
                { path: '/salary/search', icon: 'fa fa-search', text: '工资单查询', Right: 'Form.Salary.View' },
                { path: '/salary/import', icon: 'fa fa-save', text: '导入工资单', Right: 'Form.Salary.Edit' }
            ],
        }
    ],
    system: [
        {
            title: '系统管理', role: 2, items: [
                { path: '/system/config', icon: 'fa fa-gear', text: '参数配置' },
                { path: '/user/list', icon: 'fa fa-user', text: '用户管理' },
                { path: '/flow/list', icon: 'fa fa-check-square-o', text: '流程管理' },
                { path: '/group/list', icon: 'fa fa-users', text: '群组管理' },
                { path: '/department/list', icon: 'fa fa-sitemap', text: '部门管理' },
                { path: '/jobtitle/list', icon: 'fa fa-vcard', text: '职称管理' },
                { path: '/category/list', icon: 'fa fa-list', text: '分类管理' },
            ]
        }
    ]
};

const getSideMenuData = (path) => {
    if (path === '/') {
        return sideMenuData['feed'];
    }
    for (var key in sideMenuData) {
        if (!sideMenuData.hasOwnProperty(key)) continue;
        var groups = sideMenuData[key];
        var selected = getSelectedGroups(groups)
        if (selected && selected.length > 0) {
            return selected;
        }
    }
    return [];

    function getSelectedGroups(groups) {
        var selected = [];
        groups.map(group => {
            group.items.map(item => {
                if (item.path.indexOf(path) === 0) {
                    selected = groups;
                }
                return item;
            })
            return group;
        });
        if (selected.length === 0) {
            if (path.replace('/', '').indexOf(key) === 0) {
                return groups;
            }
        }
        else {
            return selected;
        }
    }
}

class Sider extends React.Component {

    handleMenuClick = (e, user) => {
        var item = e.item.props.item;
        if (this.props.pathname === item.path) {
            return false;
        }
        let path = item.path;
        path = item.path.replace('{UserId}', user.ID);

        utils.Redirect(path);
        document.title = item.text
    };

    render() {
        const user = auth.getUser();
        const groups = getSideMenuData(this.props.pathname);
        const pathname = this.props.pathname;
        const search = this.props.search;
        const url = pathname + search;

        return groups.length > 0 ?
            <div id='sider'>
                <Menu onClick={e => this.handleMenuClick(e, user)} selectedKeys={[pathname, url]} >
                    {groups.map((group, key) => {
                        var show = user.Role >= (group.role || 0);
                        return show ? <Menu.ItemGroup title={group.title || ''} key={key}>
                            {group.items.map((item, key) => {
                                var show = auth.hasRight(item.Right) && user.Role >= (item.role || 0);

                                return show ? <Menu.Item key={item.path} item={item}>
                                    <i className={item.icon} />&nbsp;{item.text}
                                </Menu.Item> : null
                            })}
                        </Menu.ItemGroup> : null
                    })}
                </Menu>
            </div>
            : <span></span>
    }
}

export default Sider