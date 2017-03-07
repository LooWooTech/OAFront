import React from 'react';
import { Button, Card, Badge, Row, Col, Calendar } from 'antd';
import LeaveFormModal from './leave_form';

export default class AttendanceIndex extends React.Component {
    state = {

    };

    onLeaveFormSubmit = (error, values) => {

    }

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
                    <Calendar />
                </Col>
                <Col span={6}>
                    <Card title="考勤统计" style={{ marginTop: "10px" }}>
                        <Badge status="default" text="正常考勤：1次" /><br />
                        <Badge status="warning" text="迟到次数：1次" /><br />
                        <Badge status="warning" text="早退次数：1次" /><br />
                        <Badge status="error" text="缺勤次数：1次" /><br />
                        <Badge status="success" text="公务请假次数：1次" /><br />
                        <Badge status="processing" text={"私事请假次数：1次"} /><br />
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