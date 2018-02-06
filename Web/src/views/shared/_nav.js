import auth from '../../models/auth'
import api from '../../models/api'

const data = [
    {
        name: 'feed', text: '动态', icon: 'fa fa-feed', path: '/?scope=all',
        children: [
            {
                title: '动态', items: [
                    { path: '/?scope=all', icon: 'fa fa-comment', text: '全部动态' },
                ],
            },
            {
                title: '类型', items: Object.keys(api.Forms).map(key => {
                    var form = api.Forms[key]
                    return { path: '/?formId=' + form.ID, icon: form.Icon, text: form.Name }
                })
            }
        ]
    },
    {
        name: 'missive', text: '公文', icon: 'fa fa-file-o', path: '/missive/list/1/?status=1',
        children: [
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
        ]
    },
    {
        name: 'attendance', text: '考勤', icon: 'fa fa-calendar-check-o',
        children: [
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
        ]
    },
    {
        name: 'task', text: '任务', icon: 'fa fa-tasks', path: '/task/?status=1',
        children: [
            {
                title: '任务', items: [
                    { path: '/task/?status=1', icon: 'fa fa-envelope-open-o', text: '待办箱' },
                    { path: '/task/?status=2', icon: 'fa fa-send', text: '在办箱' },
                    { path: '/task/?status=3', icon: 'fa fa-envelope', text: '已办箱' },
                    { path: '/task/?scope=all', icon: 'fa fa-list', text: '所有任务' },
                ]
            }
        ]
    },
    {
        name: 'mail', text: '邮件', icon: 'fa fa-envelope-o', path: '/mail/?type=receive',
        children: [
            {
                title: '我的邮箱', items: [
                    { path: '/mail/post', icon: 'fa fa-edit', text: '写邮件' },
                    { path: '/mail/?type=receive', icon: 'fa fa-envelope-open-o', text: '收件箱' },
                    { path: '/mail/?type=star', icon: 'fa fa-star-o', text: '星标邮件' },
                    { path: '/mail/?type=draft', icon: 'fa fa-pencil', text: '草稿箱' },
                    { path: '/mail/?type=send', icon: 'fa fa-send-o', text: '已发送' },
                    { path: '/mail/?type=trash', icon: 'fa fa-trash', text: '已删除' },
                    //{ path: '/mail/contacts', icon: 'fa fa-address-book-o', text: '通讯录' },
                ],
            }
        ]
    },
    {
        name: 'salary', text: '工资单', icon: 'fa fa-credit-card',
        children: [
            {
                title: '工资单', items: [
                    { path: '/salary/', icon: 'fa fa-file-text-o', text: '我的工资单' },
                    { path: '/salary/search', icon: 'fa fa-search', text: '工资单查询', right: 'Form.Salary.View' },
                    { path: '/salary/import', icon: 'fa fa-save', text: '导入工资单', role: 3 }
                ],
            }
        ]
    },
    {
        name: 'meetingroom', text: '会议室', icon: 'fa fa-tv',
        children: [
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
        ]
    },
    {
        name: 'car', text: '车辆', icon: 'fa fa-car',
        children: [
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
        ]
    },
    {
        name: 'seal', text: '公章', icon: 'fa fa-ticket',
        children: [
            {
                title: '申请', items: [
                    { path: '/seal', icon: 'fa fa-ticket', text: '图章查询' },
                    { path: `/extend1/requests/${api.Forms.Seal.ID}`, icon: 'fa fa-inbox', text: '我的申请' }
                ]
            },
            {
                title: '管理&审核', items: [
                    { path: '/seal/list', icon: 'fa fa-list', text: '图章管理', role: 2 },
                    { path: `/extend1/approvals/${api.Forms.Seal.ID}`, icon: 'fa fa-check', text: '图章审核' }
                ]
            }
        ]
    },
    {
        name: 'message', text: '消息', icon: 'fa fa-comment-o', path: '/message/?action=receive',
        children: [
            {
                title: '消息', items: [
                    { path: '/message/?action=receive', icon: 'fa fa-envelope-open-o', text: '我收到的' },
                    { path: '/message/?action=send', icon: 'fa fa-send-o', text: '我发出的' },
                ]
            },
            {
                title: '类型', items: Object.keys(api.Forms).map(key => {
                    var form = api.Forms[key]
                    return { path: '/message/?formId=' + form.ID, icon: form.Icon, text: form.Name }
                })
            }
        ],
    },
    {
        name: 'system', text: '系统', icon: 'fa fa-gear', role: 2, path: '/user/list',
        children: [
            {
                title: '系统管理', role: 2, items: [
                    { path: '/user/list', icon: 'fa fa-user', text: '用户管理' },
                    { path: '/flow/list', icon: 'fa fa-check-square-o', text: '流程管理' },
                    { path: '/group/list', icon: 'fa fa-users', text: '群组管理' },
                    { path: '/department/list', icon: 'fa fa-sitemap', text: '部门管理' },
                    { path: '/jobtitle/list', icon: 'fa fa-vcard', text: '职称管理' },
                    { path: '/category/list', icon: 'fa fa-list', text: '分类管理' },
                ]
            }
        ]
    },
];


module.exports = {
    getHeaderNav: () => {
        let user = auth.getUser();
        let list = [];
        data.map(item => {
            if (!item.role || user.Role >= item.role) {
                list.push(item)
            }
            return null
        });
        return list;
    },
    getSideMenu: path => {
        path = path || ''
        if (path === '/') {
            return data[0];
        }
        var menu = data.find(item => item.children.find(menu => menu.items.find(m => m.path.indexOf(path) === 0)));
        if (!menu) {
            menu = data.find(item => path.indexOf(item.name) === 1);
        }
        return menu;
    }
}