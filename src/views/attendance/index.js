import React from 'react';
import { Button, Card, Badge, Row, Col, Calendar } from 'antd';
import LeaveFormModal from './leave_form';
import moment from 'moment';
import api from '../../models/api';

export default class AttendanceIndex extends React.Component {
    state = {
        selectedDate: moment(),
        statistics: {
            Normal: 15,
            Late: 1,
            Early: 1,
            Absent: 1,
            OfficialLeave: 1,
            PersonLeave: 1
        },
        today: {},
        leaves: [],
        list: []
    };

    onLeaveFormSubmit = (error, values) => {
        api.Leave.Save(this, values, json => {

        })
    };

    componentWillMount() {
        this.loadData();
    }

    loadData = date => {

        date = date || moment();
        api.Attendance.List(this, { year: date.year(), month: date.month() }, json => {
            this.setState({ statistics: json });
        });
        api.Attendance.Statistics(this, { year: date.year(), month: date.month() }, json => {
            this.setState({ statistics: json })
        });
    }

    onSelect = date => {
        //设置date的打卡数据和请假数据
        this.setState({ selectedDate: date });
        if (date.month() !== this.state.selectedDate.month()) {
            this.onPanelChange(date);
        } else {
            
        }
    };

    onPanelChange = (date, mode) => {
        if (mode === 'year') return;
        this.setState({ date });
        //获取当前月的统计
        this.loadData(date);
    };

    dateCellRender = date => {
        this.state.list.map((item, key) => {
            if (item.Date === date.format()) {
                //上班下班情况
                return <span>
                    <Badge status="default" text={'正常'} /><br />
                </span>;
            }
            else {
                return <Badge status="default" text={'正常'} />;
            }
        })
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
                        value={this.state.selectedDate}
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