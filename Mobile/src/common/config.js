export const HOST = process.env.NODE_ENV === 'production' ? 'http://120.27.147.171:8080/' : 'http://192.168.2.163:8012/';
export const API_PATH = "api/";
export const API_HOST = HOST + API_PATH;
export const VERSION = "0.13";
export const FORMS = {
    Missive: { ID: 1, FlowId: 1, Name: '发文', Icon: 'edit', Color: '#46b946', Detail: 'Missive.Detail', Home: 'Missive.List', Params: { status: 1 } },
    ReceiveMissive: { ID: 2, FlowId: 2, Name: '收文', Icon: 'file-o', Color: '#f04848', Detail: 'Missive.Detail', Home: 'Missive.List', Params: { status: 1 } },
    Task: { ID: 4, FlowId: 4, Name: '任务', Icon: 'tasks', Color: '#48a9f0', Detail: 'Task.Detail', Home: 'Task.List', Params: { status: 1 } },
    Attendance: { ID: 7, FlowId: 7, Name: '考勤', Icon: 'calendar-check-o', Color: '#9266f9', Detail: 'Extend1.Detail', Home: 'Attendance' },
    Salary: { ID: 9, Name: '工资单', Icon: 'credit-card', Color: '#e2c161', Detail: 'Salary.Detail', Home: 'Salary.My' },
    Mail: { ID: 8, Name: '邮件', Icon: 'envelope-o', Color: '#eee', Detail: 'Mail.Detail', Home: 'Mail.List' },
    Car: { ID: 3, FlowId: 3, Name: '用车', Color: '#558e4f', Icon: 'car', Detail: 'Extend1.Detail', Home: 'Car.Index' },
    MeetingRoom: { ID: 5, FlowId: 5, Name: '会议室', 'Icon': 'tv', Color: '#6eacc5', Detail: 'Extend1.Detail', Home: 'MeetingRoom.Index' },
    Seal: { ID: 6, FlowId: 6, Name: '图章', Icon: 'ticket', Color: 'red', Detail: 'Extend1.Detail', Home: 'Seal.Index' },
};
export const USER_ROLE = {
    User: 1,
    Manager: 2,
    Administrator: 3
}
