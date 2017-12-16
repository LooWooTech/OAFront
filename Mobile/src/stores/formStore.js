const Forms = {
    Missive: { ID: 1, FlowId: 1, Name: '发文', Icon: 'fa fa-file-o', InfoLink: '/missive/edit/1/?id={ID}' },
    ReceiveMissive: { ID: 2, FlowId: 2, Name: '收文', Icon: 'fa fa-file', InfoLink: '/missive/edit/2/?id={ID}' },
    Car: { ID: 3, FlowId: 3, Name: '用车', Icon: 'fa fa-car', InfoLink: '/extend1/approvals/3' },
    Task: { ID: 4, FlowId: 4, Name: '任务', Icon: 'fa fa-clock-o', InfoLink: '/task/edit/?id={ID}' },
    MeetingRoom: { ID: 5, FlowId: 5, Name: '会议室', Icon: 'fa fa-television', InfoLink: '/extend1/approvals/5' },
    Seal: { ID: 6, FlowId: 6, Name: '图章', Icon: 'fa fa-dot-circle-o', InfoLink: '/extend1/approvals/6' },
    Leave: { ID: 7, FlowId: 7, Name: '请假', Icon: 'fa fa-calendar-check-o', InfoLink: '/extend1/approvals/7' },
    Mail: { ID: 8, Name: '邮件', Icon: 'fa fa-envelope-o', InfoLink: '/mail/detail?id={ID}' },
};

class FormStore {
    GetName (id) {
        let key = Object.keys(Forms).find(key => Forms[key].ID === id)
        var form = Forms[key] || {};
        return form.Name || ''
    }
    
    GetForm (formId) {
        let key = Object.keys(Forms).find(key => Forms[key].ID === formId)
        return Forms[key]
    }
}