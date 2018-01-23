import React from 'react';
import { Button, Card, Badge, Row, Col, Calendar } from 'antd';
import LeaveFormModal from './_leave_form';
import CheckButton from './_button';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import api from '../../models/api';

export default class AttendanceIndex extends React.Component {
    state = {
        loading: true,
        selectedDate: moment(),
        total: {},
        logsOfDate: [],
        leavesOfDate: [],
        leaves: [],
        logs: [],
        list: [],
        now: moment()
    };

    handleApplySubmit = (error, values) => {

    };

    componentWillMount() {
        this.loadData();
    }

    componentWillUnmount() {
        api.Abort();
    }

    loadData = date => {
        date = date || moment();
        api.Attendance.Month(date.year(), date.month() + 1, json => {
            this.setState({
                loading: false,
                ...json,
                logsOfDate: this.getLogsOfDate(json.logs, this.state.selectedDate),
                leavesOfDate: this.getLeavesOfDate(json.leaves, this.state.selectedDate),
                time: {
                    AMBeginTime: moment(json.time.AMBeginTime),
                    AMEndTime: moment(json.time.AMEndTime),
                    PMBeginTime: moment(json.time.PMBeginTime),
                    PMEndTime: moment(json.time.PMEndTime)
                }
            });
        });
    }

    getLogsOfDate = (logs, date) => logs.filter(e => moment(e.CreateTime).format('YYYYMMDD') === date.format('YYYYMMDD'))
    getLeavesOfDate = (leaves, date) => leaves.filter(e => moment(e.ScheduleBeginTime) <= date && moment(e.ScheduleEndTime) >= date)

    handleCheckInOut = () => {
        api.Attendance.CheckInOut(json => {
            if (json) {
                alert(json);
            }
            this.loadData()
        });
    }

    handleSelectDay = date => {
        //设置date的打卡数据和请假数据
        if (date.month() !== this.state.selectedDate.month()) {
            this.handlePanelChange(date);
        } else {
            this.setState({
                selectedDate: date,
                logsOfDate: this.getLogsOfDate(this.state.logs, date),
                leavesOfDate: this.getLeavesOfDate(this.state.leaves, date)
            })
        }
    };

    handlePanelChange = (date, mode) => {
        if (mode === 'year') return;
        this.setState({ selectedDate: date });
        //获取当前月的统计
        this.loadData(date);
    };

    dateCellRender = date => {
        date = moment(date.format('YYYY-MM-DDT00:00:00'))
        let model = this.state.list.find(e => moment(e.Date).format('YYYYMMDD') === date.format('YYYYMMDD'))
        var holiday = this.state.holiday.find(e => moment(e.BeginDate) <= date && date <= moment(e.EndDate))
        var leave = this.state.leaves.find(e => moment(e.ScheduleBeginTime) <= date && date <= moment(e.ScheduleEndTime))
        let today = moment();
        if (!model) {
            if (holiday) {
                return holiday.Name.indexOf('周') ? '周末' : '节假日'
            }
            if (leave && leave.Result) {
                switch (leave.InfoId) {
                    case 1:
                        return '公事请假';
                    case 2:
                        return '私事请假';
                    case 3:
                        return '病假';
                    case 4:
                        return '调休';
                    default:
                        return '请假';
                }
            }
            return date < today ? '无记录' : ''
        }
        return <ul>
            <span>

                {this.getAttendanceResult(model.AMResult, '上午')} <br />
                {this.getAttendanceResult(model.PMResult, '下午')}
            </span>
        </ul>
    };

    getAttendanceResult = (result, title) => {
        let text = "正常"
        let status = 'success'
        switch (result) {
            case 1:
                text = "未打卡"
                status = "error"
                break;
            case 2:
                text = "迟到"
                status = "warning"
                break;
            case 3:
                text = "早退"
                status = "warning"
                break;
            case 4:
                text = "请假"
                status = "processing"
                break;
            default:
                break;
        }
        return <Badge status={status} text={title + text} />
    }

    render() {
        if (this.state.loading) {
            return null
        }
        return <div>
            <div className="toolbar">
                <Button.Group>
                    <LeaveFormModal
                        onSubmit={this.handleApplySubmit}
                        children={<Button type="primary" icon="file" >申请假期</Button>}
                    />
                </Button.Group>
            </div>
            <Row>
                <Col span={18}>
                    <Calendar
                        loading={this.state.loading}
                        value={this.state.selectedDate}
                        onPanelChange={this.handlePanelChange}
                        dateCellRender={this.dateCellRender}
                        onSelect={this.handleSelectDay}
                        locale={{

                        }}
                    />
                </Col>
                <Col span={6}>
                    <CheckButton logs={this.state.logs} config={this.state.time} onClick={this.handleCheckInOut} />

                    <Card title="考勤统计" style={{ marginTop: "10px" }}>
                        <Badge status="default" text={`正常考勤：${this.state.total.Normal}次`} /><br />
                        <Badge status="warning" text={`迟到次数：${this.state.total.Late}次`} /><br />
                        <Badge status="warning" text={`早退次数：${this.state.total.Early}次`} /><br />
                        <Badge status="error" text={`缺勤次数：${this.state.total.Absent}次`} /><br />
                        <Badge status="success" text={`公务请假次数：${this.state.total.OfficialLeave}次`} /><br />
                        <Badge status="processing" text={`私人请假次数：${this.state.total.PersonalLeave}次`} /><br />
                    </Card>
                    <Card title="打卡记录" style={{ marginTop: "10px" }}>
                        {this.state.logsOfDate.length > 0 ?
                            <ul>
                                {this.state.logsOfDate.map(item => <li key={item.ID}>
                                    {moment(item.CreateTime).format('YYYY-MM-DD HH:mm')} {JSON.parse(item.ApiContent).msg}
                                </li>)
                                }</ul>
                            : <span>未打卡</span>
                        }
                    </Card>
                    <Card title="请假记录" style={{ marginTop: "10px" }}>
                        {this.state.leavesOfDate.length > 0 ? this.state.leavesOfDate.map(item => <span key={item.ID}>
                            {moment(item.ScheduleBeginTime).format('YYYY-MM-DD HH:mm')}~{moment(item.ScheduleEndTime).format('YYYY-MM-DD HH:mm')}
                        </span>)
                            : <span>未请假</span>
                        }
                    </Card>
                </Col>
            </Row>
        </div>;
    }
}