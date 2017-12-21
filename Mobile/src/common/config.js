export const HOST = process.env.NODE_ENV === 'production' ? 'http://120.27.147.171:8080/' : 'http://192.168.2.128:8012/';
export const API_PATH = "api/";
export const API_HOST = HOST + API_PATH;
export const FORMS = {
    Missive: { ID: 1, FlowId: 1, Name: '发文', Icon: 'pencil', Color: '#07a214', Detail: 'Missive.Detail', List: 'Missive.List' },
    ReceiveMissive: { ID: 2, FlowId: 2, Name: '收文', Icon: 'file-o', Color: '#4176b9', Detail: 'Missive.Detail', List: 'Missive.List' },
    Task: { ID: 4, FlowId: 4, Name: '任务', Icon: 'tasks', Color: '#079aa2', Detail: 'Extend1.Detail', List: 'Extend1.List' },
    Leave: { ID: 7, FlowId: 7, Name: '请假', Icon: 'calendar-check-o', Color: '#d834bb', Detail: 'Leave.Detail', List: 'Leave.List' },
    Salary: { ID: 9, Name: '工资单', Icon: 'credit-card', Color: '#daa731',  Detail: 'Salary.Detail', List: 'Salary.List' },
    Mail: { ID: 8, Name: '邮件', Icon: 'envelope-o', Color: '#1f91b5', Detail: 'Mail.Detail', List: 'Mail.List' },
    Car: { ID: 3, FlowId: 3, Name: '用车', Color: '#39b17a',  Icon: 'car', Detail: 'Extend1.Detail', List: 'Extend1.List' },
    MeetingRoom: { ID: 5, FlowId: 5, Name: '会议室', 'Icon': 'tv', Color: '#494cb1', Detail: 'Extend1.Detail', List: 'Extend1.List' },
    Seal: { ID: 6, FlowId: 6, Name: '图章', Icon: 'ticket',  Color: 'red', Detail: 'Extend1.Detail', List: 'Extend1.List' },
};
