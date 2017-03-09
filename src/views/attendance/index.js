import React from 'react';
import { Button, Card, Badge, Row, Col, Calendar } from 'antd';
import LeaveFormModal from './leave_form';
import moment from 'moment';
import utils from '../../utils';

export default class AttendanceIndex extends React.Component {
    state = {
        date: moment(),
        selectedDate: moment(),
        statistics: {
            Normal: 15,
            Late: 1,
            Early: 1,
            Absent: 1,
            OfficialLeave: 1,
            PersonLeave: 1
        },
        selectDateData: {

        },
        selectedEvent: {

        },
        cellData: {
            '2017-03-8': [

            ]
        }
    };

    onLeaveFormSubmit = (error, values) => {
        // api.Attendance.LeaveRequest(this,values,json=>{
        //     utils.Redirect('leavehistory');
        // });
    };

    onSelect = date => {
        //设置date的打卡数据和请假数据
        console.log(date.format());
        this.setState({ selectedDate: date, date });
    };
    onPanelChange = (date, mode) => {
        this.setState({ date });
    };

    dateCellRender = date => {
        //显示date的考勤情况
    };

    render() {
        return <div>
            <div className="toolbar">
                <Button.Group>
                    <LeaveFormModal
                        onSubmit={this.onLeaveFormSubmit}
                        children={<Button type="primary" icon="file" >申请假期</Button>}
                    />
                </Button.Group>

            </div>
            <Row>
                <Col span={18}>
                    <Calendar
                        value={this.state.date}
                        onPanelChange={this.onPanelChange}
                        dateCellRender={this.dateCellRender}
                        onSelect={this.onSelect}
                    />
                </Col>
                <Col span={6}>
                    <Card title="考勤统计" style={{ marginTop: "10px" }}>
                        <Badge status="default" text={`正常考勤：${this.state.statistics.Normal}次`} /><br />
                        <Badge status="warning" text={`迟到次数：${this.state.statistics.Late}次`} /><br />
                        <Badge status="warning" text={`早退次数：${this.state.statistics.Early}次`} /><br />
                        <Badge status="error" text={`缺勤次数：${this.state.statistics.Absent}次`} /><br />
                        <Badge status="success" text={`公务请假次数：${this.state.statistics.OfficialLeave}次`} /><br />
                        <Badge status="processing" text={`私人请假次数：${this.state.statistics.PersonLeave}次`} /><br />
                    </Card>
                    <Card title="打卡记录" style={{ marginTop: "10px" }}>
                        <Badge status="default" text="上班：" /><br />
                        <Badge status="default" text="下班：" /><br />
                    </Card>
                    <Card title="请假记录" style={{ marginTop: "10px" }}>

                    </Card>
                </Col>
            </Row>
        </div>;
    }
}